	var wxfs = wx.getFileSystemManager();
	
	export function generateUUID() {
	  let d = new Date().getTime();
	  // if (window.performance && typeof window.performance.now === 'function') {
	  //   d += performance.now()
	  // }
	  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	    let r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	  });
	  return uuid
	};
	
	export function asyncRequest(options) {
	  return new Promise((resolve, reject) => {
	    options.success = resolve
	    options.error = reject
	    wx.request(options);
	  })
	}
	
	export function asyncChooseMessageFile(options) {
	  return new Promise((resolve, reject) => {
	    options.success = resolve
	    options.error = reject
	    wx.chooseMessageFile(options)
	  })
	}
	
	export function asyncChooseImage(options) {
	  return new Promise((resolve, reject) => {
	    options.success = resolve
	    options.error = reject
	    wx.chooseImage(options)
	  })
	}
	
	export function  asyncReadFile(options){
	  return new Promise((resolve, reject) => {
	    options.success = resolve
	    options.error = reject
	    wxfs.readFile(options)
	  })
	}
	
	
	

	