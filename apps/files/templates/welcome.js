 
 function askUserPopup(){
//confirm('Welcome!! Would like to take a tour of this website');
var res= confirm('Welcome!! Would like to take a tour of this website');
//global.res_bool = res;
if(res){
	welcomeResponseYes();
}
else if(!res){
	welcomeResponseNo();
}
}