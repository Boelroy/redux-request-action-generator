### redux-request-action-generator

这个库是为了减少 redux 中异步请求的代码

### 基本用法：

在 action 文件中
```javascript
import { generator } from 'redux-request-action-generator';

const actionGenerator = generator('UNIQUE_ID');

export requestAction = (data) => 
  generator('ACTION_1', 'SOME_URL', 'GET', 'dataselector').request(somedata);

```

在reducer文件中
```javascript
import { reducer as requestReduce } from 'redux-request-action-generator';

export requestReduce('UNIQUE_ID')(initailState); // 这里的 UNIQUE_ID 和 action 中的必须保持一样

```
