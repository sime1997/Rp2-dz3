$(document).ready(function(){
var data=new Array();
function measures(data_type,data_value)///ovdje pamtimo podatke za jedno mjerenje
     {
       this.data_type=data_type;
       this.data_value=data_value;
     }

var oneChart=new Array();///pamtimo sva mjerenja jedan data-datase i sve spanove unutar njega
function chart(data_dataset,values)
     {
       this.data_dataset=data_dataset;
       this.values=values;
     }


var examples=new Array()///pamtimo sve primjere
function  example(example_title,chart_title,chart,data_xlabel,data_ylabel)
    { 
      this.example_title=example_title;
      this.chart_title=chart_title;
      this.chart=chart;
      this.data_xlabel=data_xlabel;
      this.data_ylabel=data_ylabel;
    }



    var maxi=0;//on mi treba da odredim sirinu canvasa, gledam najvecu vrijednost
for(var i=0;i<$("div.chart").length;i++) ///prva for() petlja ide po svima primjerima
    {var pom1=$("div.chart").eq(i);
     
     
     for(var j=0;j<pom1.children("div").length;j++)///for() petlja koja ide po svim "mjerenjima"
        {
         var pom2=pom1.children("div").eq(j);
         for(var k=0;k<pom2.children("span").length;k++)//ide kroz sve spanove za jedno mjerenje
              {pom3=pom2.children("span").eq(k);
               if(parseInt(pom3.attr("data-value"))>maxi) maxi=parseInt(pom3.attr("data-value"));
               let pom=new measures(pom3.html(),pom3.attr("data-value"));
               data.push(pom);
              }
        
        pom=new chart(pom2.attr("data-dataset"),data);
        oneChart.push(pom);
        data=[];
        }


pom=new example($("h2").eq(i).html(),pom1.attr("title"),oneChart,pom1.attr("data-xlabel"),pom1.attr("data-ylabel"));
examples.push(pom);///zapamceni svi podaci
oneChart=[];
      }


///ovdje sam dohvatio sve podatke, sad ih treba napisati;
var number=$("h2").length;
number=number*700;///za visinu canvasa
$("body").html('<canvas style="border:solid 1px" id="myCanvas"></canvas>');
myCanvas.height=number;
myCanvas.width=maxi*3+200;
 var ctx = $("#myCanvas").get(0).getContext("2d");
 ctx.fillStyle="black";

 ctx.font="bold 25px Verdana";
 for(i=0;i<examples.length;i++)//pisem naslove primjera
     ctx.fillText(examples[i].example_title,10,20+700*i);
     
 ctx.font="bold 15px Verdana";
 for(i=0;i<examples.length;i++)///zbog fonta dvije razlicite for() petlje
     ctx.fillText(examples[i].chart_title,250,50+700*i);
    
 
 ctx.font="10px Verdana"  
 for(i=0;i<examples.length;i++)//po primjerima prolazim
   {var max=0;
    var remember=new Array();
     for(j=0;j<examples[i].chart[0].values.length;j++)///prolazim po prvom mjerenju, i dohvacam druge vrijednosti za isti pojam tj stvar
       { var rem=examples[i].chart[0].values[j].data_type;
         var lista=new Array();///lista za jedan element prvog mjerenja pamti sve vrijednosti po svim mjerenjima
        for(var k=0;k<examples[i].chart.length;k++) 
            for(var l=0;l<examples[i].chart[k].values.length;l++)
                 if(rem===examples[i].chart[k].values[l].data_type)          
                   lista.push(examples[i].chart[k].values[l].data_value);
       ctx.fillText(rem,10,90+700*i+j*90);
       dim=ctx.measureText(rem);
       if(max<=dim.width) max=dim.width;///pamtimo podatak sa max duljinom
       remember.push(lista);//remember zapamtio koje sve vrijednosti poprima jedan pojam(npr EUL) iz drugog primjera
       lista=[];
       }
  ctx.beginPath();              
  ctx.moveTo(max+15,80+700*i);    
  ctx.lineTo(max+15,80+700*i+j*90);///ovdje sam izabrao j jer j jednak broju spanova unutar jednog mjerenja
  ctx.stroke();
var maxValue=0;///ovo mi treba da odredim duljinu x osi
 for(var m=0;m<remember.length;m++)
     for(k=0;k<remember[m].length;k++)
     //nacrtaj pravokutnik;  
     {ctx.fillStyle ="rgb(" + k*70 + ", 0, " + k*70 + ")" ;
      ctx.beginPath();  
      ctx.fillRect(max+15,80+700*i+90*m+k*10,remember[m][k]*3,8);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.fillText(remember[m][k],max+20+remember[m][k]*3,88+700*i+90*m+k*10);
      if(maxValue<parseInt(remember[m][k])) maxValue=parseInt(remember[m][k]);
     }
  
  ctx.beginPath();
  ctx.moveTo(max+15,80+700*i+j*90);//tu smo zavrsili sa y osi
  ctx.lineTo(max+maxValue*(ctx.measureText(" ").width),80+700*i+j*90);
  ctx.stroke();  
//legende
for(var n=0;n<examples[i].chart.length;n++)
    {
    ctx.fillText(examples[i].chart[n].data_dataset,max+15+30,90+700*i+j*90+10+15*n+8);
    
    ctx.beginPath();
    ctx.fillStyle ="rgb(" + n*70 + ", 0, " + n*70 + ")" ;
    ctx.fillRect(max+15,90+700*i+j*90+10+15*n,20,10);
    ctx.stroke();
    ctx.fillStyle="black";
    }
ctx.font="Italic 10px Verdana"
if(examples[i].data_xlabel)
    ctx.fillText(examples[i].data_xlabel,10,700*i+65);
if(examples[i].data_ylabel)
    ctx.fillText(examples[i].data_ylabel,max+maxValue*(ctx.measureText(" ").width)-50,90+700*i+j*90)  
    ctx.font="Normal 10px Verdana"
}
 })          