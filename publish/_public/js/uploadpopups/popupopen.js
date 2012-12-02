function popitup() {
	var x = (screen.width - 500) / 2;
	var y = (screen.height - 200) / 2;	
	newwindow=window.open('/upload','name','screenx='+x+',screeny='+y+',height=100,width=500');
	if (window.focus) {newwindow.focus()}
	return false;
}
