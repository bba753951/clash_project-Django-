function exampletable(mtype){
    var data_url;
    $("#search").addClass( "load");
    if (mtype==="regulator"){
        data_url="/master_project/master_media/uploadfile/example/step6_regulator_transcript.json";
    }else{
        data_url="/master_project/master_media/uploadfile/example/step6_transcript_regulator.json";
    };


	$.ajax({
		type: "GET",//方法类型
		url: copy_example_url ,//url
        cache:false,
        processData:false,
        contentType:false,
		success: function (result) {
			console.log(result);
            }
    })

    $('#example').dataTable().fnDestroy(); // destroy dataTable !!!!
    $('#example').html("");
    
    $('#example').dataTable({
        "ajax": data_url,
        "destroy":true,
        "columns":[{"title":"Regulator Name"},{"title":"Transcript Sum"},{"title":"Transcript Name"}],
        "aoColumnDefs":[
            {
                "aTargets":[-1],
                "mData": function ( source, type, val  ) {return source},
                "mRender" : function(data,type,full){
                    var value;
                    if(data[1]==="0")
                        value = "show target site"
                    else
                        value = '<a target="_blank" href="'+site_link+"?name="+data[0]+"&mtype="+mtype+'&sfile=original">show target site</a>';
                    return value
                }
            }
        ],
        "order": [[ 1, 'desc'  ]],
        "initComplete": function() {
            $("#search").removeClass( "load");
        }
    });

}
// ----------- input parameter -------------
function infoHover(userID){
    var infodata_url="/master_project/master_media/uploadfile/"+userID+"/info_para.txt";
    $("#input_para").qtip({
        content: {
            text: function(event, api) {
                $.ajax({ url: infodata_url })
                    .done(function(html) {
                        api.set('content.text', html)
                    })
                    .fail(function(xhr, status, error) {
                        api.set('content.text', status + ': ' + error)
                    })

                return 'Loading...';
            }
        },
        show: {
            effect: function(offset) {
                $(this).slideDown(50); 
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
    $("input_para").hover(function(){
        $(this).css("opacity",0.2)
    },function(){
        $(this).css("opacity",1)
    });

}

function uploadfile() {

    $("#search").addClass( "load");

    var data_url;

    mtype=$(".select_type input[type=radio]:checked").val();
    filetype=$(".select_file input[type=radio]:checked").val();

    if($('#example_data').prop("checked")){
        //$('#example_data').prop("checked",false);
        exampletable(mtype);
        return;
    }

    console.log("click");//打印服务端返回的数据(调试用)
    var file5=$("input[name='upload_file']").get(0).files[0];
    var files_data = new FormData();

    $("input[type='text']").each(function(){
        console.log($(this).attr("id"))
        files_data.append($(this).attr("id"),$(this).val());
    });
    files_data.append("upload_file",file5);
    files_data.append("mtype",mtype);
    files_data.append("filetype",filetype);

	$.ajax({
		type: "POST",//方法类型
		//dataType: "json",//预期服务器返回的数据类型
		url: upload_url ,//url
		data: files_data,
        cache:false,
        processData:false,
        contentType:false,
		success: function (result) {
			console.log(result);
            var col = 0;
            if(result.data.length > 3){col=1};

            if (mtype==="regulator"){
                data_url="/master_project/master_media/uploadfile/"+result.userID+"/step6_regulator_transcript.json";
            }else{
                data_url="/master_project/master_media/uploadfile/"+result.userID+"/step6_transcript_regulator.json";
            };

            //$('#example').dataTable().fnClearTable(); // clear dataTable !!!!
            $('#example').dataTable().fnDestroy(); // destroy dataTable !!!!
            $('#example').html("");
            
            $('#example').DataTable({
                "ajax": data_url,
                "destroy":true,
                "columns":result.data,
                "aoColumnDefs":[
                    {
                        "aTargets":[-1],
                        "mData": function ( source, type, val  ) {return source},
                        "mRender" : function(data,type,full){
                            var value;
                            if(data[col+1]==="0")
                                value = "show target site"
                            else
                                value = '<a target="_blank" href="'+site_link+"?name="+data[col]+"&mtype="+mtype+"&userID="+result.userID+'&sfile=original">show target site</a>';
                            return value
                        }
                    }
                ],
                "order": [[ col+1, 'desc'  ]],
                "initComplete": function() {
                    $("#search").removeClass( "load");
                    $("#download_output").attr("href","/master_project/master_media/uploadfile/"+result.userID+"/download.zip");
                    $(".option").css("display","block");
                    infoHover(result.userID);
                }
            });
                    },
		error : function() {
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'please check your ID is correrct or not',
                
            })
                //.then((result) => {
                //if (result.value){
                    //$('#example').dataTable().fnDestroy(); // destroy dataTable !!!!
                    //$('#example').html("");
                //}
            //})
            $("#search").removeClass( "load");
		}
	});

}



var btn = document.getElementById("search");  
btn.addEventListener('click',uploadfile);



function changefile(name){
  
  $('input[name='+name+']').bind('change', function () {
    var filename = $(this).val();
    console.log(filename);
    if (/^\s*$/.test(filename)){
      $(this).prev('span').children('.cfile').text("(no file)")
    }else{
      $(this).prev('span').children('.cfile').text("("+filename.replace("C:\\fakepath\\", "")+")");
    }

  })
  
}

//var file_name=["transcript_file","regulator_file","original_file","gene_file"];
//var file_text=["Transcript Name","Regulator Name","Original Output","Gene to Transcript"];

//for(i=0;i<file_name.length;i++){
  //changefile(file_name[i]);
//}
changefile("upload_file")


function changeExample(){
    if($('#example_data').prop("checked"))
        $('span span.cfile').text("(example data)")
    else
        $('span span.cfile').text("(no file)")
}

$('#example_data').click(changeExample)


function changeFile(){
    if($('#ID').prop("checked")){
        $('.ID_check').css('display','block');
        $('.file_check').css('display','none');
    }else{
        $('.ID_check').css('display','none');
        $('.file_check').css('display','block');
    }
}

$('.file_check').css('display','none');
$('#ID').change(changeFile)
$('#upload').change(changeFile)


if(folder_id != ""){
    $('#folder_id').val(folder_id);
}

