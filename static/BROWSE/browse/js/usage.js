
function addHoverTip(name,info_table){

    $(name).qtip({
        content: {
            text:info_table,
        },
        show: {
            effect: function(offset) {
                $(this).slideDown(100); 
            }},
        hide: {
            fixed:true,
            },
		position: {
			//target: $('#show_site'),
            my:'bottom right',
            at:'top center'
		},
        style: {
              classes: 'qtip-dark'
              //classes: 'qtip-dark qtip-jtools'
        }
    })  
    $(name).hover(function(){
        $(this).css("opacity",0.2)
    },function(){
        $(this).css("opacity",1)
    });
}

function uploadfile() {
    $("#pbar").css("display","flex");
    console.log("click");//打印服务端返回的数据(调试用)
    var file1=$("input[name='zip_file']").get(0).files[0];
    //var file2=$("input[name='transcript_file']").get(0).files[0];
    //var file3=$("input[name='regulator_file']").get(0).files[0];
    //var file4=$("input[name='gene_file']").get(0).files[0];
    var files_data = new FormData();
    files_data.append("zip_file",file1);
    //files_data.append("transcript_file",file2);
    //files_data.append("regulator_file",file3);
    //files_data.append("gene_file",file4);

    $("input[type='text']").each(function(){
        console.log($(this).attr("id"))
        files_data.append($(this).attr("id"),$(this).val());
    });



	$.ajax({
		type: "POST",//方法类型
		url: usage_url ,//url
		data: files_data,
        cache:false,
        processData:false,
        contentType:false,
		success: function (result) {
            console.log("ok");
                    },
		error : function() {
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                
            })
		},
		xhr: function(){
        // get the native XmlHttpRequest object
        var xhr = $.ajaxSettings.xhr() ;
        // set the onprogress event handler
        $('#p').attr('max', 100);
        $('#p').attr('value', 0);

        xhr.upload.onprogress = function(evt){ 
            var width =  evt.loaded/evt.total*100;
            $("#myBar").css("width",width+"%");
            $("#Percentage").text(Math.floor(width) + '%');
            console.log('progress', width) 

        } ;
        // set the onload event handler
        xhr.upload.onload = function(){ 
            console.log('DONE!') 
            Swal.fire({
                  icon: 'success',
                  title: 'Check your E-amil',
                  text: 'You need to recive a mail from us and click the link to start analysis',
            })
        } ;

        //$("#pbar").css("display","none");
        // return the customized object
        return xhr ;
    }
	});
}

var btn = document.getElementById("search");  
btn.addEventListener('click',uploadfile);



var d_uf="<span class='info'>Please prepare the following files as a \"compressed file\" (.zip) and use \"same file name\" like following<br><br>1. hyb_file.fastq(Required):<br>&nbsp;&nbsp;&nbsp;Fastq file of CLASH data<br><br>2. reg_file.csv(Required):<br>&nbsp;&nbsp;&nbsp;must have \"transcript_name\" <br>&nbsp;&nbsp;&nbsp;and \"sequence\" column name<br><br>3. reg_file.csv(Required): <br>&nbsp;&nbsp;&nbsp; must have \"regulator_name\" <br>&nbsp;&nbsp;&nbsp;and \"sequence\" column name<br><br> 4. gene_file.csv(Optional):<br>&nbsp;&nbsp;&nbsp;must have \"transcript_name\" <br>&nbsp;&nbsp;&nbsp;and \"Gene_name\" column name</span>";
var d_as="<span class='info'>For \"trim_galore\" parameter to remove adaptor sequence from hybrid reads.<br><br>If not specified,trim_galore will auto detect. Such as:<br>Illumina: AGATCGGAAGAGC<br>Small RNA: TGGAATTCTCGG<br>Nextera: CTGTCTCTTATA</span>";
var d_hl="<span class='info'>For \"trim_galore\" parameter to select hybrid reads length (greater equal) <br><br>You can\'t use 0 !!!</span>";
var d_rc="<span class='info'>Select hyrbrid's \"read count\" (greater equal)</span>";
var d_rm="<span class='info'>Use \"RNAfold\" (from ViennaRNA package) to calculate \"minimum free energy\" (mfe) of hybrid reads.<br><br>This option selects the \"RNAfold_MFE\" column (less equal).<br><br>You can use None to not select</span>";
var d_rhm="<span class='info'>Use \"bowtie\" to align regulator sequence to hybrid reads.<br><br> You can choose the mismatch count between 0 to 2</span>";
var d_rsl="<span class='info'>Select sequence length of remaining sequence which gets from hybrid reads (greater than)</span>";
var d_rtm="<span class='info'>Use \"bowtie\" to align remaining sequence to transcript sequence.<br><br>You can choose the mismatch count between 0 to 2</span>";
var d_rs="<span class='info'>Use \"RNAup\" (from ViennaRNA package) to calculate the \"thermodynamics\" of regulator sequence and transcript sequence and find the target pos.<br><br>This option selects the \"RNAup_score\" column (less equal).<br><br>You can use None to not select</span>";
var d_gts="<span class='info'>If you not input None,this option will use \"GU targeting algorithm\" to calculate the \"GU_targeting_score\" between regulator sequence and transcript sequence. <br><br>Then select the \"GU_targeting_score\" column (greater equal)</span>";
var d_em="<span class='info'>We use this mail to inform you how to start the analysis and see the result</span>";

addHoverTip("#d_uf",d_uf);
addHoverTip("#d_as",d_as);
addHoverTip("#d_hl",d_hl);
addHoverTip("#d_rc",d_rc);
addHoverTip("#d_rm",d_rm);
addHoverTip("#d_rhm",d_rhm);
addHoverTip("#d_rsl",d_rsl);
addHoverTip("#d_rtm",d_rtm);
addHoverTip("#d_rs",d_rs);
addHoverTip("#d_gts",d_gts);
addHoverTip("#d_em",d_em);


function drawFlowchart(){

//---------------create SVG
var width = $('.right-opt').width()-40;
var height = $('.right-opt').height();
var rectY=30;
var down_arrow=20;
var down_arrow_len=down_arrow-5;
var rectY_all=rectY*9+8*down_arrow
var svg = d3.select("#flowchart")
  .append("svg")
  .attr("width", width)
  .attr("height", rectY_all)
  .attr("style","background:#EBECF0;")
  //.attr("viewbox","0,0,"+10000+","+10000)
  //.attr("preserveAspectRatio","xMidYMax slice");
  

//---------------create scale
var xScale = d3.scale.linear()
  .domain([0,1000])
  .range([0,width]);

//var yScale = d3.scale.linear()
  //.domain([0,1000])
  //.range([0,height]);
if(rectY_all >height){
    $('#flowchart').css("overflow","auto")
    $('#flowchart').height(height)
}

pos_array=[[0,0,1,"Clash Raw Data"],[1,1,1,"Process Hybrid(1)"],[2,2,1,"Process Hybrid(2)"],[3,3,1,"Find Regulator"],[4,4,1,"Find Target"],[5,5,1,"Predit Target Position"],[6,6,1,"Organize Result"],[7,7,1,"Add Gene Info."],[8,8,1,"Web Browse"],[9,3,0,"Regulator File"],[10,4,0,"Transcript File"],[11,7,0,"Gene File(Optional)"]]
//---------------plot rect
var rectSite = svg.selectAll("rect")
  .data(pos_array)
  .enter()
  .append("rect")
  .attr("id",function(d,i){
    return "flow"+d[0]
  })
  .attr("fill", "red")
  .attr("y", function(d){
      return d[1]*rectY+d[1]*down_arrow;
  })
  .attr("x", function(d){
      return d[2]*xScale(550)
    })
  .attr("width", xScale(450))
  .attr("height", rectY)


//
//
var defs = svg.append('svg:defs')
var marker=defs.append('svg:marker')
    .append('svg:marker')
      .attr('id', "arrow")
      .attr('markerHeight', 10)
      .attr('markerWidth', 10)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', "6")
      .attr('refY', "6")
      .attr('viewBox', "0 0 12 12")
      .append('svg:path')
        .attr('d', "M2,2 L10,6 L2,10 L6,6 L2,2")
        .attr('fill', "black");
//------------plot arrow 
arrow_array=[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[0,3],[0,4],[0,7]];
var line = svg.selectAll("line")
            .data(arrow_array)
            .enter()
            .append("line")
             .attr("x1",function(d){
                var value=xScale(780);
                if(d[0] === 0){
                   value=xScale(450);
                }
                return value
            })  
             .attr("y1",function(d){
                var value=d[1]*(rectY+down_arrow)+rectY;
                if(d[0] === 0){
                   value=d[1]*(rectY+down_arrow)+rectY/2;
                }
                return value
            })   
             .attr("x2",function(d){
                var value=xScale(780);
                if(d[0] === 0){
                   value=xScale(545);
                }
                return value
            })    
             .attr("y2",function(d){
                var value=d[1]*(rectY+down_arrow)+rectY+down_arrow_len;
                if(d[0] === 0){
                   value=d[1]*(rectY+down_arrow)+rectY/2;
                }
                return value
            })  
             .attr("stroke","black")  
             .attr("stroke-width",2)  
             .attr("marker-end","url(#arrow)")

//------------ add text
var rectSite = svg.selectAll("text")
  .data(pos_array)
  .enter()
  .append("text")
  .attr("id",function(d,i){
    return "text"+d[0]
  })
  .attr("fill", "white")
  .attr("y", function(d){
      return d[1]*rectY+d[1]*down_arrow+rectY*2/3;
  })
  .attr("x", function(d){
      return d[2]*xScale(550)+xScale(40);
    })
  .style('font-size', xScale(40)+'px')
  .style('font-weight', 'bold')
  .text(function(d){
      return d[3]
  })
    
function flowHover(object,target){
    $(object).hover(
        function() {
            $(target).addClass("flow_hover");
        }, function() {
            $(target).removeClass("flow_hover");
        }
    );
}

flowHover("#flow0","#d_uf");
flowHover("#flow1","#d_as");
flowHover("#flow1","#d_hl");
flowHover("#flow2","#d_rc");
flowHover("#flow2","#d_rm");
flowHover("#flow3","#d_rhm");
flowHover("#flow3","#d_rsl");
flowHover("#flow4","#d_rtm");
flowHover("#flow5","#d_rs");
flowHover("#flow5","#d_gts");
flowHover("#flow9","#d_uf");
flowHover("#flow10","#d_uf");
flowHover("#flow11","#d_uf");


flowHover("#text0","#d_uf");
flowHover("#text1","#d_as");
flowHover("#text1","#d_hl");
flowHover("#text2","#d_rc");
flowHover("#text2","#d_rm");
flowHover("#text3","#d_rhm");
flowHover("#text3","#d_rsl");
flowHover("#text4","#d_rtm");
flowHover("#text5","#d_rs");
flowHover("#text5","#d_gts");
flowHover("#text9","#d_uf");
flowHover("#text10","#d_uf");
flowHover("#text11","#d_uf");


// ---------------- hover info
var h0="<ol class='hover_info'><li>Your upload file name must be hyb_file.fastq</li><li>must be fastq format</li></ol>"
var h1="<ol class='hover_info'><li>Use trim_galore to remvoe</li><li>Use trim_galore to select Hybrid Length(greater equal)</li><li>Unique hybrid reads and calculate read conut</li></ol>"
var h2="<ol class='hover_info'><li>Select read count (greater equal)</li><li>Use RNAfold to calculate RNAfold_MFE</li><li>Select RNAfold_MFE (less equal)</li></ol>"
var h2="<ol class='hover_info'><li>Use bowtie to align regulator sequence to hybrid reads</li><li>Remove regulator sequence from sequence and decide remaining sequence</li><li>Select remaining sequence length </li>(greater equal)</li></ol>"
var h3="<ol class='hover_info'><li>Use bowtie to align remaining sequence to transcript sequence</li></ol>"
var h4="<ol class='hover_info'><li>Use  RNAup to calculate RNAup_score</li><li>Select RNAup_score (less equal)</li><li>Predit target position</li><li>(Optional) Use GU targeting algorithm to calculate GU_target_score</li><li>(Optional) Select GU_target_score (greater equal)</li></ol>"
var h5="<ol class='hover_info'><li>Select RNAfold_MFE, RNAup_score ,GU_target_score</li><li>Organize result</li></ol>"
var h6="<ol class='hover_info'><li>Add Gene information</li></ol>"
var h9="<ol class='hover_info'><li>Your upload file name must be reg_file.csv</li><li>Must be csv format</li><li>Must have regulator_name and sequence column name</li></ol>"
var h10="<ol class='hover_info'><li>Your upload file name must be tran_file.csv</li><li>Must be csv format</li><li>Must have transcript_name and sequence</li><li>column name</li></ol>"
var h11="<ol class='hover_info'><li>Your upload file name must be gene_file.csv</li><li>Must be csv format</li><li>Must have regulator_name and Gene_name column name</li></ol>"

addHoverTip("#flow0",h0);
addHoverTip("#flow1",h1);
addHoverTip("#flow2",h2);
addHoverTip("#flow3",h3);
addHoverTip("#flow4",h4);
addHoverTip("#flow5",h5);
addHoverTip("#flow6",h6);
addHoverTip("#flow9",h9);
addHoverTip("#flow10",h10);
addHoverTip("#flow11",h11);


addHoverTip("#text0",h0);
addHoverTip("#text1",h1);
addHoverTip("#text2",h2);
addHoverTip("#text3",h3);
addHoverTip("#text4",h4);
addHoverTip("#text5",h5);
addHoverTip("#text6",h6);
addHoverTip("#text9",h9);
addHoverTip("#text10",h10);
addHoverTip("#text11",h11);
}

drawFlowchart();
$(window).resize(function(){
    var svg = d3.select("#flowchart");
    svg.selectAll("*").remove();
    drawFlowchart();
});
