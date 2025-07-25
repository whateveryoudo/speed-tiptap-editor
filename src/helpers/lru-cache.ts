/**
 * LRU (Least Recently Used) 缓存实现
 * 使用双向链表 + 哈希表实现 O(1) 的访问和更新效率
 * 支持本地存储持久化
 */

import { safeJSONStringify } from './json';
import { getStorage, setStorage } from './storage';

/**
 * 双向链表节点类
 * 用于维护缓存项的访问顺序
 */
class Node {
  public key: string;                // 节点的键
  public value: string | number;     // 节点的值
  public prev: Node | null;          // 前一个节点的引用
  public next: Node | null;          // 后一个节点的引用

  constructor(key: string, value: string | number) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * LRU 缓存核心类
 * 使用双向链表维护访问顺序，哈希表实现快速查找
 */
export class LRUCache {
  private capacity: number;          // 缓存容量
  private usedCapacity: number;      // 当前已使用的容量
  private head: Node;                // 头节点（最近使用）
  private tail: Node;                // 尾节点（最久未使用）
  private store: Record<string, Node>; // 哈希表存储，用于O(1)时间查找节点

  constructor(capacity: number) {
    this.capacity = capacity || 20;  // 默认容量为20
    this.usedCapacity = 0;
    this.store = {};
    // 创建头尾哨兵节点，简化边界情况处理
    this.head = new Node('fakeHeadNode', 'fakeHeadNode');
    this.tail = new Node('fakeTailNode', 'fakeTailNode');

    // 初始化双向链表
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 从双向链表中移除指定节点
   * @param node 要移除的节点
   */
  private removeNode(node: Node): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
  }

  /**
   * 将节点添加到链表头部（表示最近使用）
   * @param node 要添加的节点
   */
  private addToHead(node: Node): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) {
    this.head.next.prev = node;
    }
    this.head.next = node;
  }

  /**
   * 将已存在的节点移动到链表头部
   * @param node 要移动的节点
   */
  private moveToHead(node: Node): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  /**
   * 移除链表尾部节点（最久未使用的节点）
   * @returns 被移除的节点或null
   */
  private removeTail(): Node | null {
    const node = this.tail.prev;
    if (node && node !== this.head) {
    this.removeNode(node);
    return node;
  }
    return null;
  }

  /**
   * 获取缓存中的值
   * @param key 键
   * @returns 值，如果不存在返回-1
   */
  get(key: string): string | number {
    if (key in this.store) {
      const node = this.store[key];
      this.moveToHead(node);  // 访问后移动到头部
      return node.value;
    }
    return -1;
  }

  /**
   * 设置缓存值
   * @param key 键
   * @param value 值
   */
  put(key: string, value: string | number): void {
    if (key in this.store) {
      // 更新已存在的节点
      const node = this.store[key];
      node.value = value;
      this.moveToHead(node);
    } else {
      // 创建新节点
      const node = new Node(key, value);
      this.addToHead(node);
      this.store[key] = node;
      this.usedCapacity += 1;

      // 如果超出容量，删除最久未使用的节点
      if (this.usedCapacity > this.capacity) {
        const tailNode = this.removeTail();
        if (tailNode) {
        delete this.store[tailNode.key];
        this.usedCapacity -= 1;
      }
    }
  }
  }

  /**
   * 获取所有缓存的键（按最近使用顺序）
   * @returns 键数组
   */
  keys(): string[] {
    const res: string[] = [];
    let node: Node | null = this.head;

    while (node) {
      if (node !== this.head && node !== this.tail) {
      res.push(node.key);
      }
      node = node.next;
    }

    return res;
  }

  /**
   * 获取所有缓存的值（按最近使用顺序）
   * @returns 值数组
   */
  values(): (string | number)[] {
    const res: (string | number)[] = [];
    let node: Node | null = this.head;

    while (node) {
      if (node !== this.head && node !== this.tail) {
      res.push(node.value);
      }
      node = node.next;
    }

    return res;
  }

  /**
   * 获取缓存的JSON表示
   * @returns 存储的键值对对象
   */
  toJSON(): Record<string, Node> {
    return this.store;
  }
}

/**
 * 创建一个支持本地存储的LRU缓存实例
 * @param storageKey localStorage中的键名
 * @param capacity 缓存容量
 * @returns 缓存管理器
 * 
 * @example
 * // 创建一个容量为20的最近菜单缓存
 * const recentMenuCache = createKeysLocalStorageLRUCache('RECENT_MENU_LIST', 20);
 * 
 * // 添加项
 * recentMenuCache.put('menu1');
 * 
 * // 获取所有最近使用的项
 * const recentItems = recentMenuCache.get();
 */
export const createKeysLocalStorageLRUCache = (storageKey: string, capacity: number) => {
  const lruCache = new LRUCache(capacity);

  const manager = {
    syncFromStorage() {
      const data = getStorage(storageKey);
      if (Array.isArray(data)) {
        // 清空当前缓存
        lruCache.keys().forEach(key => {
          delete lruCache.toJSON()[key];
        });
        // 从后往前添加，保持顺序
        data.slice().reverse().forEach((key) => {
          lruCache.put(key, key);
        });
      }
    },

    syncToStorage() {
      // 获取去重后的 keys
      const keys = Array.from(new Set(lruCache.keys()));
      setStorage(storageKey, keys);
    },

    put(key: string) {
      // 如果已存在，先删除旧的
      if (key in lruCache.toJSON()) {
        const node = lruCache.toJSON()[key];
        lruCache.removeNode(node);
      }
      // 添加新的
      lruCache.put(key, key);
      this.syncToStorage();
    },

    get(key?: string) {
      this.syncFromStorage();
      if (key) {
        return lruCache.get(key);
      } else {
        // 返回去重后的 keys
        return Array.from(new Set(lruCache.keys()));
      }
    },
  };

  return manager;
};
