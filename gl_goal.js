var gl;											//главная GL херня

var posx_g;										//x игрока  
var posy_g;										//y игрока
var posx_m; 									//x монстрика
var posy_m;										//y монстрика
var bal;										//количество, собранных монеток!

var k = 38;										//количество буферов (по количеству кратинок)
var flag;										//флаг прыжка
var fl_p;										//флаг pause
var rab;										//номер исходной картинки
var y_m;										//положение по у монеток

var canvas;										//тут все ясно, хост
var currentlyPressedKeys = new Array();			//массив нажатых клавишь
						
var shaderProgram;								//главная шейдерная херня	
var resolutionLocation;							//это нам для шейдера, зачем только -___-				

var objVertexPositionBuffer = new Array();		//координатный буффер
var objVertexTextureCoordBuffer = new Array(); 	//текстурный буффер

var kol, kol_b, kol_br, kol_ya;					//пока костыли
var mouseDown = false;							//отслеживание мышки
var mas_mon = new Array();						//массив монеток
var mas_fl = new Array();						//массив флагов
var mas_fon = new Array();						//массив фонов
var mas_fon_fl = new Array();					//массив фонов флагов
var mas_br = new Array();						//массив бомбы
var mas_br_fl = new Array();					//массив бомбы флагов
var mas_br_y = new Array();						//массив у бомб
var mas_brev = new Array();						//массив бревен
var mas_yac = new Array();						//массив якорей
var texture = new Array();						//массив айдишников текстур

var s;											//скорость человечка
var s_m;										//скорость момнеток
var s_b;										//скорость бомб
var s_br;										//скорость бревен
var s_ya;										//скорость якорей

var mus = 0;									//флаг на проигрыш музыки
var fl_bl;										//для какого-то хитрого подсчета ага -____-	
var fl_over;								    //конец игры!	
var code;										//не перезаписыват!!	

var met;										//метры
var his;										//истории
var cl_st;										//закрыта ли история		

var mas_shu = new Array();						//координаты по у шупальцев
var s_x, s_y;									//координаты звезды
var fl_shit;									//защита от бомб
var go;											//пробег с аурой

var mas_point = new Array(20, 50, 100, 300, 700); 
var mas_pr = new Array(							//массив правил
"Сперва выберите персонажа, за которого будете играть. Для начала нашего славного приключения нажмите клавишу d. Бежать от врага тебе поможет та же самая клавиша. А клавиши w и s помогут тебе уворачиваться от бомб и ловить монетки столько ценные в нашем деле. На пути тебе буду встречать якори и бревна, ",
"увиливай от них, иначе предеться начать заново! Следи за черепками, что появляются в правом углу экрана, чем больше их, тем ближе ты к открытию новой части истории. Для каждого героя своя легенда! Собери все!<br/>  Открытые истории закрывают при нажатии на enter!",
"Если ты захочешь отдохнуть, то жми p, или воспользуйся кнопкой на панели.",
"Надоела музыка? Воспользуйся панельными кнопками. Там же имеются и регуляторы громкости. Не теряйся!",
"Хочешь узнать о нас? Ищи кнопку с мотором, там ты узнаешь не только о нашей команде, но и об обновлениях игры!"
);		
var num_pr;										//номер открытого правила			
//---------------------------клавиши, мышки-----------------------------------------------
function handleKeyDown(event) 
{
	currentlyPressedKeys[event.keyCode] = true;
}
	 
function handleKeyUp(event) 
{
    currentlyPressedKeys[event.keyCode] = false;
}

function move_obj(num, sp, mas_m)
{
	for(var v = 0; v < num; v++) mas_m[v] -= sp;
}
function handleKeys() 
{
	if (currentlyPressedKeys[80] && flag) 
	{
		Pause();
		currentlyPressedKeys[80] = false;
	}
	if(document.getElementById('over').style.display!='block'&&flag&&fl_p&&!cl_st)
	{
		if (currentlyPressedKeys[68]) 
		{
			posx_m -= 1;
			move_obj(kol, s_m, mas_mon);
			move_obj(11, s, mas_fon);
			move_obj(kol_b, s_b, mas_br);
			move_obj(kol_br, s_br, mas_brev);
			move_obj(kol_ya, s_ya, mas_yac);
			if(fl_shit) go += s;
			s_x--;
			met += s;
			for(var f = 0; f<8; f++)
			{
				mas_shu[f] = Math.floor((Math.random()*10)-5) + posy_m;
			}	
		}
		if (currentlyPressedKeys[87]) 
		{
			if(posy_g>0) posy_g -= 5;
		}
		if (currentlyPressedKeys[83]) 
		{
			if(posy_g<370) posy_g += 5;
		}
    }
    if (currentlyPressedKeys[68]&&!flag&&rab) 
	{
		flag = 1;
	}
	if(currentlyPressedKeys[13])
	{
		Close();
	}
}

//---------------------------инициализация всего-----------------------------------------
function init_GL()
{
	canvas=document.getElementById("canvas");
	gl=getWebGLContext(canvas);
	if(!gl)
	{
		alert('Ваши драйвера утстарели или ваше видео карта не подерживает WebGL!');
		return;
	}
	
	gl.enable ( gl.BLEND ) ;
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	//-------------------------пошли монетки инит-----------------------------------------
	y_m = Math.floor((Math.random()*400)+10);
	kol = Math.floor((Math.random()*10)+1);
	mas_mon[0] = Math.floor((Math.random()*700)+500);
	mas_fl[0] = 1;
	for(var i = 1; i < kol; i++) 
	{
		mas_mon[i] = mas_mon[i-1] + 50;
		mas_fl[i] = 1;
	}
	
	//-----------------------фоны инит----------------------------------------------------
	for(var i = 0; i < 11; i++) 
	{
		mas_fon[i] = 700*i;
		mas_fon_fl[i] = 0;
	}
	mas_fon_fl[0] = 1;
	mas_fon_fl[1] = 1;
	
	//----------------------бомбы инит----------------------------------------------------
	kol_b = Math.floor((Math.random()*10)+1);
	mas_br[0] = Math.floor((Math.random()*700)+500);
	mas_br_y[0] = Math.floor((Math.random()*400)+10);
	mas_br_fl[0] = 1;
	for(var i = 1; i < kol_b; i++)
	{
		mas_br[i] = mas_br[i-1] + Math.floor((Math.random()*200)+50);
		mas_br_y[i] = Math.floor((Math.random()*400)+10);
		mas_br_fl[i] = 1;
	}
	
	//---------------------щупальцы кальмарчика-------------------------------------------
	for(var f = 0; f<8; f++)
	{
		mas_shu[f] = Math.floor((Math.random()*10)-5) + posy_m;
	}
	
	//---------------------бревна инит----------------------------------------------------
	kol_br = Math.floor((Math.random()*2)+1);
	mas_brev[0] = Math.floor((Math.random()*700)+700);
	for(var i = 1; i < kol_br; i++)
	{
		mas_brev[i] = mas_brev[i-1] + Math.floor((Math.random()*300)+100);
	}
	
	//---------------------якоря инит----------------------------------------------------
	kol_ya = Math.floor((Math.random()*2)+1);
	mas_yac[0] = Math.floor((Math.random()*700)+600);
	for(var i = 1; i < kol_ya; i++)
	{
		mas_yac[i] = mas_yac[i-1] + Math.floor((Math.random()*300)+100);;
	}
}

function initShader()
{
	vertexShader=createShaderFromScriptElement(gl,"2d-vertex-shader");
	fragmentShader=createShaderFromScriptElement(gl,"2d-fragment-shader");
	
	shaderProgram = gl.createProgram();
	
	gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
	
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Can`t initialise shaders');
    }
	
	gl.useProgram(shaderProgram);
	
	shaderProgram.vertexPositionAttribute=gl.getAttribLocation(shaderProgram,"a_position");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	
	shaderProgram.textureCoordAttribute=gl.getAttribLocation(shaderProgram,"a_texCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
	
	resolutionLocation=gl.getUniformLocation(shaderProgram,"u_resolution");
	gl.uniform2f(resolutionLocation,canvas.width,canvas.height);
	
}

function initBuff()
{
	for(var i=0; i<k; i++)
	{
		objVertexPositionBuffer[i] = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, objVertexPositionBuffer[i]);
	}
	var i = 0;
	objVertexTextureCoordBuffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, objVertexTextureCoordBuffer[i]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),gl.STATIC_DRAW);
}

function initTex(texture)
{
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function createTex(image_name)
{
	var image = new Image();
	var texture = gl.createTexture();
	image.src = image_name;
	texture.image = image;
	image.onload = function()
	{
		initTex(texture);
	}
	return texture;
}
//---------------------------повторы--------------------------------------------------
function pov(px, py, w, h, nu)
{
	gl.bindTexture(gl.TEXTURE_2D, texture[nu]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, objVertexPositionBuffer[nu]);
					
	setRectangle(gl, px, py, w, h);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,2,gl.FLOAT,false,0,0);
					
	gl.bindBuffer(gl.ARRAY_BUFFER, objVertexTextureCoordBuffer[0]);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,2,gl.FLOAT,false,0,0);
					
	gl.drawArrays(gl.TRIANGLES,0,6);
	gl.bindTexture(gl.TEXTURE_2D, null);
}
//---------------------------отрисовка------------------------------------------------
var pos = 0;
var kon = 20;
var kl = 0;
function drawScene()
{	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(go>1200){ fl_shit = 0; go = 0; }															//халява кончилась
	for(var j = 0; j<5; j++)
	{
		if(bal==mas_point[j]&&!fl_bl)
		{
			s_m ++;
			s ++;
			s_b ++;
			s_br ++;
			s_ya ++;
			fl_bl = 1;
			story();
			fl_p = 0;
			pos = j + 1;
		}
		if(bal==mas_point[j]+1) fl_bl = 0;
	}
	if(rab != 0)													//выбран ли герой!
	{
		if(posx_g-80<=posx_m&&posx_g>=posx_m||fl_over) gameOver();	//не пора ли заканчивать?)
		else
		{
			if(flag&&fl_p&&!cl_st)									//можно ли нам двигать?)
			{	
				move_obj(kol, s_m, mas_mon);
				move_obj(11, s, mas_fon);
				move_obj(kol_b, s_b, mas_br);
				move_obj(kol_br, s_br, mas_brev);
				move_obj(kol_ya, s_ya, mas_yac);
				if(fl_shit) go += s;
				s_y++;
				met += s;
				for(var f = 0; f<8; f++)
				{
					mas_shu[f] = posy_m + Math.floor((Math.random()*10)-5);
				}	
				if(posy_g<360) 
				{
					posy_g+=1; 
				}
				else
				{			
					if(posy_g<410) 
					{
						posy_g-=1;
					}
				}
				posx_m += 1;
			}
			var i;
			
			//---------------------фон----------------------------------------------------------
			if(mas_fon[10] <= 0)
			{
				for(var j = 0; j < 11; j++) 
				{
					mas_fon[j] = 700*j;
					mas_fon_fl[j] = 0;
				}
				mas_fon_fl[0] = 1;
				mas_fon_fl[1] = 1;
			}
			
			for(i=0; i<11; i++)
			{
				if(mas_fon_fl[i])
				{
					pov(mas_fon[i], 0, 700, 700, i);
				}
				if(mas_fon[i] < -700)
				{		
					mas_fon_fl[i] = 0;
					mas_fon_fl[(i + 2) % 11] = 1;
				}
			}
			//---------------------монетки------------------------------------------------------
			i = 25;
			if(mas_mon[kol - 1] < -100)
			{
				y_m = Math.floor((Math.random()*400)+10);
				kol = Math.floor((Math.random()*10)+2);
				mas_mon[0] = Math.floor(700 + Math.random()*1000);
				mas_fl[0] = 1;
				for(var v = 1; v < kol; v++)
				{
					mas_mon[v] = mas_mon[v-1] + 50;
					mas_fl[v] = 1;
				}
			}
				
			for(var q = 0; q<kol; q++)
			{
				if(mas_fl[q])
				{
					if(posy_g>=y_m-100 && posy_g<=y_m+50 && posx_g<=mas_mon[q] && posx_g>=-50+mas_mon[q])
					{
						bal ++;
						document.getElementById("bal").innerHTML = bal;
						mas_fl[q] = 0;	
					}
					pov(mas_mon[q], y_m, 50, 50, i);
				}
			}
			//---------------------монстр----------------------------------------------------------
			i = 26;
			var f = 0;
			for(var gk = i; gk < k - 1; gk++)
			{
				if(gk==26) pov(posx_m, posy_m, 200, 200, gk);
				else { pov(posx_m, mas_shu[f], 200, 200, gk); f++};
			}
			
			//---------------------герой--------------------------------------------------------
			pov(posx_g,posy_g, 100, 100, rab);
			
			//---------------------бомбы---------------------------------------------------------
			i = 24;
			
			if(mas_br[kol_b - 1] < -100)
			{
				var asd = 0;
				for(var q = 0; q<kol_b; q++)
				{
					if(mas_br_fl[q]) asd++;
				}
				if(asd == kol_b) if(posx_m-10>=0) posx_m -=10;
				kol_b = Math.floor((Math.random()*10)+1);
				mas_br[0] = Math.floor((Math.random()*700)+500);
				mas_br_y[0] = Math.floor((Math.random()*400)+10);
				mas_br_fl[0] = 1;
				for(var i = 1; i < kol_b; i++)
				{
					mas_br[i] = mas_br[i-1] + Math.floor((Math.random()*200)+50);
					mas_br_y[i] = Math.floor((Math.random()*400)+10);
					mas_br_fl[i] = 1;
				}
			}
				
			for(var q = 0; q<kol_b; q++)
			{
				if(mas_br_fl[q])
				{
					if(posy_g>= mas_br_y[q]-100 && posy_g<= mas_br_y[q]+50 && posx_g<=mas_br[q] && posx_g>=-50+mas_br[q])
					{
						mas_br_fl[q] = 0;	
						if(!fl_shit) posx_m += 5; 													//если аура не поймана
					}
					pov( mas_br[q], mas_br_y[q], 50, 50, i);
				}
			}
			//-----------------------------------бревна---------------------------------------------------
			i = k - 3;
			if(mas_brev[kol_br - 1] < -200)
			{
				kol_br = Math.floor((Math.random()*2)+1);
				mas_brev[0] = Math.floor((Math.random()*700)+700);
				for(var j = 1; j < kol_br; j++)
				{
					mas_brev[i] = mas_brev[i-1] + Math.floor((Math.random()*300)+100);
				}
			}
			for(var j = 0; j<kol_br; j++)
			{
				if(posy_g + 50 >= 370 && posy_g <= 370 + 100 && posx_g <= mas_brev[j] + 160 && posx_g + 30 >= mas_brev[j])
				{	
					fl_over = 1;
				}
				pov(mas_brev[j], 370, 200, 100, i);
			}
			
			//-----------------------------------якорь---------------------------------------------------
			i = k - 2;
			if(mas_yac[kol_ya - 1] < -100)
			{
				kol_ya = Math.floor((Math.random()*2)+1);
				mas_yac[0] = Math.floor((Math.random()*700)+700); 
				for(var j = 1; j < kol_ya; j++)
				{
					mas_yac[j] = mas_yac[j-1] + Math.floor((Math.random()*300)+100);
				}
			}
			for(var j = 0; j<kol_ya; j++)
			{
				if(posy_g + 50 >= 0 && posy_g<= 165 && posx_g + 50 >= mas_yac[j] && posx_g<=30+mas_yac[j])
				{	
					fl_over = 1;
				}
				pov(mas_yac[j], 0, 84, 200, i);
			}
			
			//------------------------------бонус!!!------------------------------------------------------		
			i = k - 1;
			var ah = Math.floor((Math.random()*100) + 1);
			if(s_y>400&&ah==2&&!fl_shit) 
			{
				s_x = Math.floor((Math.random()*700) + 300);
				s_y = -70;
			}
			if(posx_g + 50 >= s_x && posx_g <= s_x && posy_g + 50 >= s_y &&posy_g <= s_y) 
			{
				s_y = 500;
				fl_shit = 1;
			}
			pov(s_x, s_y, 50, 50, i);
			if(fl_shit)
			{
				pov(600, 60, 25, 25, i);
			}
				
			//------------------------------черепушечки----------------------------------------------------
			i = 23;
			if(pos==0 && bal==mas_point[pos]*kon/100)
			{ 
				kl++; 
				kon += 20;
			}
			else if(bal-mas_point[pos-1]==(mas_point[pos]-mas_point[pos-1])*kon/100){ kl++; kon += 20;}
			for(var l = 0; l < kl; l++)
			{
				pov(580 - 50*l, 5, 50, 50, i);
			}
		}
	}
}


function main()
{
	Start();
	
	document.getElementById("p2").innerHTML = mas_pr[num_pr];	
	document.getElementById("p5").innerHTML = "Игра разработана командой <a href=\"http://fk-2o13.diary.ru/?tag=4902746\">fandom Pirates of the Caribbean 2013</a> для Фандомной битвы - 2013 на <a href=\"http://www.diary.ru/\">diary.ru</a> <br/>";
	//-----------------чтоб этот js!! с циклом не срабатывает, собака -___---------------
	
	texture[0] = createTex("back_01.jpg");
	texture[1] = createTex("back_02.jpg");
	texture[2] = createTex("back_03.jpg");
	texture[3] = createTex("back_04.jpg");
	texture[4] = createTex("back_05.jpg");
	texture[5] = createTex("back_06.jpg");
	texture[6] = createTex("back_07.jpg");
	texture[7] = createTex("back_08.jpg");
	texture[8] = createTex("back_09.jpg");
	texture[9] = createTex("back_10.jpg");
	texture[10] = createTex("back_01.jpg");
	
	//-------------------------------загрузка играков-------------------------------------
	
	texture[11] = createTex("1.png");
	texture[12] = createTex("2.png");
	texture[13] = createTex("3.png");
	texture[14] = createTex("4.png");
	texture[15] = createTex("5.png");
	texture[16] = createTex("6.png");
	texture[17] = createTex("7.png");
	texture[18] = createTex("8.png");
	texture[19] = createTex("9.png");
	texture[20] = createTex("10.png");
	texture[21] = createTex("11.png");
	texture[22] = createTex("12.png");
	
	//---------------------------------атрибутика-----------------------------------
	
	texture[23] = createTex("pol.png");
	texture[24] = createTex("br.png");
	texture[25] = createTex("den.png");
	texture[26] = createTex("kraken0.png");
	texture[27] = createTex("kraken1.png");
	texture[28] = createTex("kraken2.png");
	texture[29] = createTex("kraken3.png");
	texture[30] = createTex("kraken4.png");
	texture[31] = createTex("kraken5.png");
	texture[32] = createTex("kraken6.png");
	texture[33] = createTex("kraken7.png");
	texture[34] = createTex("kraken8.png");
	
	texture[35] = createTex("brev.png");
	texture[36] = createTex("yac.png");
	texture[37] = createTex("sv.png");
	
	//document.getElementById('player').play();
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
   
	drawFrame(); 
}

function setRectangle(gl,x,y,width,height)
{
	var x1=x;
	var x2=x+width;
	var y1=y;
	var y2=y+height;
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([x1,y1,x2,y1,x1,y2,x1,y2,x2,y1,x2,y2]),gl.STATIC_DRAW);
}

function drawFrame() 
{
	requestAnimFrame(drawFrame);
	handleKeys();
	drawScene();
}

//----------------------------------------всякие доп. окна------------------------------
function ChangeImage(num, kul)
{
	var g = "";
	switch(kul)
	{
		case 1: g = "im1"; pic = "1.png"; break;
		case 2: g = "im2"; pic = "2.png"; break;
		case 3: g = "im3"; pic = "3.png"; break;
		case 4: g = "im4"; pic = "4.png"; break;
		case 5: g = "im5"; pic = "5.png"; break;
		case 6: g = "im6"; pic = "6.png"; break;
		case 7: g = "im7"; pic = "7.png"; break;
		case 8: g = "im8"; pic = "8.png"; break;
		case 9: g = "im9"; pic = "9.png"; break;
		case 10: g = "im10"; pic = "10.png"; break;
		case 11: g = "im11"; pic = "11.png"; break;
		case 12: g = "im12"; pic = "12.png"; break;
	}
	if(num==2)
	{
		rab = 10 + kul;
		document.getElementById("wind").style.display = "none";
		document.getElementById("wind_bal").style.display = "block";
	}
	else
	{
		if(num) document.getElementById(g).width="110";
		else document.getElementById(g).width="100";
	}
}

function Close()
{
	if(document.getElementById('wind_story').style.display=='block')
	{
		document.getElementById('wind_story').style.display='none';
		fl_p = 1;
		kon = 20;
		kl = 0;
		cl_st = 0;
	}
}
function Close_about()
{
	document.getElementById('wind_about').style.display='none';
	return false;
}

function card()
{
	document.getElementById('wind').style.display='block'; 
	return false;
}

function story()
{
	his++;
	document.getElementById("p4").innerHTML = "Bоодушевляющая история!<br/> бла-бал-бла-бла-бла-бла-бла-бла-бла-бал-бла-бла-бла-бла";
	document.getElementById('wind_story').style.display='block';
	cl_st = 1;
	return false;
}
//----------------------обнуление все, начинаем все заново!-----------------------------
function Start()
{
	posx_g = 200; 
	posy_g = 350;
	posx_m = 0; 
	posy_m = 260;
	bal = 0;
	rab = 0;
	flag = 0;
	fl_p = 1;
	s = 1;										
	s_m = 2;									
	s_b = 3;
	s_br = 2;
	s_ya = 2;
	fl_bl = 0;
	kon = 20;
	pos = 0;
	kl = 0;
	code = 0;
	fl_over = 0;
	met = 0;
	his = 0;
	num_pr = 0;
	cl_st = 0;
	
	fl_shit = 0;
	go = 0;
	
	s_x = Math.floor((Math.random()*700) + 200);
	s_y = -70;
	
	init_GL();
	initShader();	
	initBuff();
	
	card();
	
	document.getElementById("p2").innerHTML = mas_pr[num_pr];
	
	document.getElementById("wind_bal").style.display = "none";
	document.getElementById("bal").innerHTML = "0";
	
	document.getElementById('over').style.display='none';
	document.getElementById('code_vs').style.display='none';
}

//------------------------------------перервыв на твикс---------------------------------
function Pause()
{
	if(flag) if(fl_p) fl_p = 0; else fl_p = 1;
}

//-------------------------------------конец игры---------------------------------------
function gameOver()
{
	document.getElementById("wind_bal").style.display = "none";
	document.getElementById('over').style.display='block'; 
	document.getElementById('code_vs').style.display='block'; 
	if(!code)
	{
		met = (met - met%100)/100;
		document.getElementById('p3').innerHTML = "Игра закончена!<br/><br/>Количество монет......" + bal + "<br/>Пройдено метров......." + met + "<br/>Открыто историй......." + his;
	
		var s = "<textarea autofocus=\"autofocus\" id=\"inptext\" style=\"width:100%; height:100px; \" ><div style = \"width: 300px; height: 160px; color: #000; front-size: 10px; border-radius: 4px; background-color:#716a21; box-shadow: 2px 2px 6px #333, inset 0px 0px 10px #a89130; border: 1px solid #a18f52; filter: alpha(opacity=98); -moz-opacity: 0.98; -khtml-opacity: 0.98; opacity: 0.98;\" align=\"center\" >";
		s += "<p style = \"margin-top: 15px;\">Ваш результат!</p><table cellpadding = 5> <tr><td>Количество монет</td><td width='100px' align=\"right\">" + bal + "</td></tr>";
		s += "<td>Пройдено метров</td><td width='100px' align=\"right\"> " + met + "</td></tr><tr>";
		s += "<td>Открыто историй</td><td width='100px' align=\"right\">" + his + "<td></tr></table>";
		s += "<a href=\"http://secure-dawn-4913.herokuapp.com/\">Играть снова?</a>";
		s += "</div></textarea>";
		document.getElementById("p6").innerHTML=s;
		code = 1;
	}
	return false;
}

//------------------------------------об игре и создателях------------------------------
function About()
{
	document.getElementById('wind_about').style.display='block';
	return false;
}

//-------------------------------------промотка правил----------------------------------
function List()
{
	if(num_pr == mas_pr.length - 1)  num_pr = 0;
	else num_pr++; 
	document.getElementById("p2").innerHTML = mas_pr[num_pr];
	return false;
}