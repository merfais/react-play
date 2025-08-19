import { useState, useRef } from 'react';
import { set, isPlainObject } from 'lodash-es';

// 定义State类型为任意对象
type State = Record<string, any>;

// 定义更新函数的重载签名
interface UpdateStateFunction<S extends State> {
  (partialState?: Partial<S> | ((state: S) => void)): void;
  (path: string, value: any): void;
}

// 定义ProxyState类型，继承原始类型并添加$forceUpdate和$set方法
type ProxyState<S extends State> = S & {
  $forceUpdate: UpdateStateFunction<S>;
  $set: UpdateStateFunction<S>;
};

// 定义返回的数组类型
type StateReturnArray<S extends State> = [ProxyState<S>, UpdateStateFunction<S>];

type StateReturn<S extends State> = StateReturnArray<S> & ProxyState<S> & Record<string, any>;

// 定义函数类型，支持泛型推断
export function useDefineState<S extends State>(state: S | (() => S)): StateReturn<S> {
  const [, update] = useState({});

  // 通过ref控制，多次运行只用initial的值
  const stateRef = useRef<S | null>(null);
  if (!stateRef.current) {
    // 对齐useState的接口，函数格式的参数，只运行一次。
    const meta = typeof state === 'function' ? state() : state;
    stateRef.current = { ...meta };
  }

  const ref = useRef<StateReturn<S> | null>(null);
  if (ref.current) {
    return ref.current;
  }

  // 创建state的代理对象
  const stateProxy = new Proxy(stateRef.current, {
    get(target, prop, receiver) {
      // 内置函数，用于重绘组件
      if (prop === '$forceUpdate') {
        return forceUpdate;
      }
      // 内置函数，用于按path写入比较生层的数据
      if (prop === '$set') {
        return updateState;
      }
      return Reflect.get(target, prop, receiver);
    },
    // eslint-disable-next-line max-params
    set(target, prop, value, receiver) {
      if (prop === '$forceUpdate') {
        console.error('内置函数，不可被覆盖');
        return false;
      }
      if (prop === '$set') {
        console.error('内置函数，不可被覆盖');
        return false;
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });

  /**
   * 对外暴露两种格式的用法
   * const [state, setState] = useDefineState(() => ({}))
   * const state = useDefineState(() => ({}))
   */
  ref.current = new Proxy([stateProxy, forceUpdate], {
    get(target, prop, receiver) {
      // 按第1种数组格式取接口
      if (/^[0,1]$/.test(String(prop))) {
        return Reflect.get(target, prop, receiver);
      }
      // 按第2种对象格式取接口
      return Reflect.get(stateProxy, prop, stateProxy);
    },
    set(target, prop, value) {
      return Reflect.set(stateProxy, prop, value, stateProxy);
    },
  }) as StateReturn<S>;

  function forceUpdate(...args: Parameters<UpdateStateFunction<S>>) {
    updateState(...args);
    update({});
  }

  function updateState(...args: Parameters<UpdateStateFunction<S>>) {
    const [newState, value = undefined] = args;
    /**
     * 使用path格式更新state，方便更新深层的state
     * state.$forceUpdate('a.b.c', '')
     */
    if (typeof newState === 'string') {
      set(stateProxy, newState, value);
    }

    /**
     * 使用function格式更新state, 方便更新深层的state
     * state.$forceUpdate(state => {
     *  state.a.b.c = ''
     * })
     */
    if (typeof newState === 'function') {
      (newState as (state: S) => void)(stateProxy);
      return;
    }

    /**
     * 使用对象格式更新state，常规更新方式
     * state.$forceUpdate({
     *  a: ''
     * })
     */
    if (isPlainObject(newState)) {
      Object.assign(stateProxy, { ...(newState as unknown as Partial<S>) });
      return;
    }

    // 其他格式，直接忽略
  }
  return ref.current;
}

// 基础函数类型，支持任意参数和返回值
type ActionFunction = ((...args: any[]) => any) | undefined | null;

// 支持类型映射的Actions
type Actions = Record<string, ActionFunction>;

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDefineActions<A extends Actions>(actions: A) {
  // 每次渲染，将actions给一个缓存在稳定的引用上
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const actionRef = useRef<A>({} as A);
  Object.assign(actionRef.current, { ...actions });

  // 每个actions生成一个不变的引用，引用内调用缓存的actions
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const ref = useRef<A>({} as A);
  Object.keys(actions).forEach(k => {
    // 强制断言类型
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const key = k as keyof A;
    if (!ref.current[key] && typeof actionRef.current[key] === 'function') {
      type Args = Parameters<NonNullable<A[typeof key]>>;
      ref.current[key] = ((...args: Args) => {
        const fn = actionRef.current[key] as (...args: Args) => any;
        return fn(...args);
      }) as A[typeof key];
    }
  });

  // 防止被修改，用proxy代理一下，只代理一次
  const proxyRef = useRef<Readonly<{ [K in keyof A]: A[K] }>>();
  if (!proxyRef.current) {
    proxyRef.current = new Proxy(ref.current, {
      set() {
        return false;
      },
    });
  }

  return proxyRef.current;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = () => {};
