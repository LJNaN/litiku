export const debounce = (fn,delay = 100,promptly) => {
	let timer = null;
	return function(...args) {
		// 立即执行
		if(promptly) {
			// 当timer为null时执行
			if(!timer) fn.apply(this,args);
			if(timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer = null;
			},delay)
		}else {
			if(timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				fn.apply(this,args);
			},delay)
		}
	}
}