
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
            my:'top right',
            at:'bottom center'
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
    console.log("click");
    //var file1=$("input[name='zip_file']").get(0).files[0];
    var files_data = new FormData();
    //files_data.append("zip_file",file1);

    $("input[type='file']").each(function(){
        console.log($(this).attr("name"))
        var file1=$(this).get(0).files[0];
        files_data.append($(this).attr("name"),file1);
    });


    $("input[type='text']").each(function(){
        console.log($(this).attr("id"))
        files_data.append($(this).attr("id"),$(this).val());
    });

    $("select").each(function(){
        files_data.append($(this).attr("id"),$(this).val());
    })



	$.ajax({
		type: "POST",
		url: analyse_url ,
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
                  html: 'You need to recive a mail from us and <span class="stress_red">click the link</span> to start analysis',
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


//upload file hint
var d_uf="<span class='info'>Please prepare the following files as a \"compressed file\" (.zip) <br><br>And use \"<span class='stress'>same file name</span>\" as following:<br><br><ol><li> <span class='stress'>read.fastq(Required)</span>:<br>FASTQ format,for CLASH read</li><li><span class='stress'>regulator.fasta(Required)</span>:<br>FASTA format,for regulaotry RNA</li><li> <span class='stress'>targetRNA.fasta(Required)</span>: <br>FASTA format ,for target RNA (transcript)</li><li><span class='stress'>gene_file.csv(Optional)</span>:<br>Must have \"transcript_name\" and \"Gene_name\" column name</li></ol></span>";
var d_em="<span class='info'>We use this mail to inform you how to start the analysis and see the result</span>";
addHoverTip("#d_uf",d_uf);
addHoverTip("#d_em",d_em);

// preprocess hint

var d_as="<span class='info'> Remove adapter sequence from CLASH reads.<br><br> Such as:<br>Illumina: AGATCGGAAGAGC<br>Small RNA: TGGAATTCTCGG<br>Nextera: CTGTCTCTTATA</span>";
var d_hl_g="<span class='info'>After trimming adapter,select the CLASH length (greater than) <br><br>You can\'t use 0 !!!</span>";
var d_hl_l="<span class='info'>After trimming adapter,select the CLASH length (less than) <br><br>You can\'t use 0 !!!</span>";
var d_ps="<span class='info'>Trim low-quality ends from reads in addition to adapter removal</span>";
var d_tt="<span class='info'>Select which program to trim adapter </span>";

addHoverTip("#d_as",d_as);
addHoverTip("#d_hl_g",d_hl_g);
addHoverTip("#d_hl_l",d_hl_l);
addHoverTip("#d_ps",d_ps);
addHoverTip("#d_tt",d_tt);

// quality
var d_rc="<span class='info'>Select \"read count\" of CLASH read (greater equal)</span>";
var d_rm="<span class='info'>Use \"RNAfold\" (from ViennaRNA package) to calculate \"minimum free energy\" (mfe) of CLASH reads.<br><br>This option selects the \"RNAfold_MFE\" column (less equal).<br><br>You can use None to not select</span>";

addHoverTip("#d_rc",d_rc);
addHoverTip("#d_rm",d_rm);
// Find Pairs
// -------- pir ----------
var d_atrm_p="<span class='info'>Use \"bowtie\" to align regulatory to CLASH reads.<br><br> You can choose the mismatch count between 0 to 2</span>";
var d_attm_p="<span class='info'>Use \"bowtie\" to align remaining sequence to target RNA.<br><br>You can choose the mismatch count between 0 to 2</span>";
var d_rsl_p="<span class='info'>Select sequence length of remaining sequence which gets from CLASH read (greater than)</span>";
var d_hph_p="<span class='info'>Max hits per CLASH read (not including different of position)</span>";
// -------- hyb ----------
var d_hst_h="<span class='info'>Fragment selection threshold </span>";
var d_obf_h="<span class='info'>Max gap/overlap between fragments </span>";
var d_hph_h="<span class='info'>Max hits per read (including different of position)</span>";
// -------- clan ----------
var d_fl_c="<span class='info'>Minimum length for each fragment </span>";
var d_obf_c="<span class='info'>Maximum overlap allowed between fragments </span>";
var d_hpf_c="<span class='info'>Number of maximum hits for each maximal fragment</span>";

addHoverTip("#d_atrm_p",d_atrm_p);
addHoverTip("#d_attm_p",d_attm_p);
addHoverTip("#d_rsl_p",d_rsl_p);
addHoverTip("#d_hph_p",d_hph_p);
addHoverTip("#d_hst_h",d_hst_h);
addHoverTip("#d_obf_h",d_obf_h);
addHoverTip("#d_hph_h",d_hph_h);
addHoverTip("#d_fl_c",d_fl_c);
addHoverTip("#d_obf_c",d_obf_c);
addHoverTip("#d_hpf_c",d_hpf_c);
// analyse
var d_rs="<span class='info'>Use \"RNAup\" (from ViennaRNA package) to calculate the \"thermodynamics\" of regulatory RNA and target RNA ,then find the binding site.<br><br>This option selects the \"RNAup_score\" column (less equal).<br><br>You can use None to not select</span>";

addHoverTip("#d_rs",d_rs);


//============= flow click ==============
var curr_index=0;
$(".lshow").eq(0).css("display","block");
$(".rshow").each(function(index){
    $(this).click(function(){
        $(".rshow").eq(curr_index).removeClass("rclick");
        $(".lshow").eq(curr_index).css("display","none");
        $(".lshow").eq(index).css("display","block");
        $(this).addClass("rclick");
        curr_index=index;
    })
})

$(".next_btn").click(function(){
        $(".rshow").eq(curr_index).removeClass("rclick");
        $(".lshow").eq(curr_index).css("display","none");
        curr_index++;
        $(".lshow").eq(curr_index).css("display","block");
        $(".rshow").eq(curr_index).addClass("rclick");
})



//===============upload file =================
function changefile(name,text){
  
  $('input[name='+name+']').bind('change', function () {
    var filename = $(this).val();
    console.log(filename);
    if (/^\s*$/.test(filename)){
      $(this).prev('span').text(text)
    }else{
      $(this).prev('span').text(filename.replace("C:\\fakepath\\", ""));
    }

  })
  
}
changefile("zip_read","no file");
changefile("zip_regulator","no file");
changefile("zip_target","no file");

//===============find pair way =================
var current_way=$('#find_way').val()
$('#find_way').bind('change', function(){
    $('.find_'+current_way).css('display','none')
    current_way=$(this).val()
    $('.find_'+current_way).css('display','block')
})

//===============adapter option =================
$('#trimmed_tool').bind('change', function(){
    var tool=$(this).val()
    if(tool==="trim_galore"){
        $('#ada_opt').text("(optional)")
    }else{
        $('#ada_opt').text("(required)")
    }
})
