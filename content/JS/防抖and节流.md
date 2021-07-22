### 防抖和节流

1. 防抖：在事件被触发 N 秒后在执行回调，如果在这 N 秒内又被触发，则重新计时
   - 实现思路：通过闭包保存一个标记来保存 setTimeout 返回的值，每当用户输入的时候把前一个 setTimeout clear 掉，然后又创建一个新的 setTimeout，这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数了。

```javascript
function debounce(fn, interval = 300) {
	let timeout = null;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn.apply(this, arguments);
		}, interval);
	};
}
function scroll(e) {
	console.log(e);
}
window.onscroll = debounce(scroll, 500);
```

2. 节流：规定一个单位时间，在这个单位时间内，只能执行一次回调，如果触发了多次，只有一次生效
   - 实现思路: 函数的节流就是通过闭包保存一个标记（canRun = true），在函数的开头判断这个标记是否为 true，如果为 true 的话就继续执行函数，否则则 return 掉，判断完标记后立即把这个标记设为 false，然后把外部传入的函数的执行包在一个 setTimeout 中，最后在 setTimeout 执行完毕后再把标记设置为 true（这里很关键），表示可以执行下一次的循环了。当 setTimeout 还未执行的时候，canRun 这个标记始终为 false，在开头的判断中被 return 掉。

```javascript
function throttle(fn, interval = 300) {
	let canRun = true;
	return function () {
		if (!canRun) return;
		canRun = false;
		setTimeout(() => {
			fn.apply(this, arguments);
			canRun = true;
		}, interval);
	};
}
```