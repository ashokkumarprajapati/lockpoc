function popuplinkedin() {
	var x = (screen.width - 500) / 2;
	var y = (screen.height - 200) / 2;	
	newwindow=window.open('/auth','name','screenx='+x+',screeny='+y+',height=300,width=600');
	if (window.focus) {newwindow.focus()}
	return false;
}
