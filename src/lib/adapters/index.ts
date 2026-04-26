// 适配器工厂 - 通过环境变量控制使用模拟数据或真实API

import type { DataAdapter } from "@/types";
import { MockDataAdapter } from "./MockDataAdapter";

// 当接入真实合规API时，实现 RealDataAdapter 并在此切换
// export { RealDataAdapter } from "./RealDataAdapter";

export function getDataAdapter(): DataAdapter {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  switch (source) {
    case "mock":
    default:
      return new MockDataAdapter();
    // case "real":
    //   return new RealDataAdapter();
  }
}

export { MockDataAdapter };
