setInterval(
	function()
	{
		var f=new Date();
		
		// mostramos la hora actual
	

		// si la hora actual coincide con la hora indicada...
		if( f.getHours()==document.getElementById("hora").value &&
			f.getMinutes()==document.getElementById("min").value
			
		)
		{
			var audio = new Audio('alarm.mp3');

			// al finalizar el sonido escondemos el mensaje de "Alarma sonando"
			audio.onended=function(){
				document.getElementById("sono").innerHTML="";
			};
			document.getElementById("sono").innerHTML="";
			
			// Iniciamos el sonido
			audio.play();
		}
	},1000
);
