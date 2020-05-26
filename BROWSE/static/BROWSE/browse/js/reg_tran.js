column1=[
        {"title":"Transcript Name"},
        {"title":"Number of sites"},
        {"title":"More Info"}
    ];

column2=[
        {"title":"Gene Name"},
        {"title":"Transcript Name"},
        {"title":"Number of sites"},
        {"title":"More Info"}
    ];

column=[column1,column2]

$('#example').DataTable({
    "data": tdata,
    "destroy":true,
    "columns":column[gene_exist],
    "aoColumnDefs":[
        {
            "aTargets":[-1],
            "mData": function ( source, type, val  ) {return source},
            "mRender" : function(data,type,full){
                var value;
                if(data[gene_exist+1]+""==="0")
                    value = "show target site"
                else
                    value = '<a target="_blank" href="'+site_link+"?name="+data[gene_exist]+"&regulator="+regulator_name+"&userID="+userID+"&way="+way+'&mtype=transcript&sfile=ori_reg">show target site</a>';
                return value
            }
        }
    ],
    "order": [[ gene_exist+1, 'desc'  ]]

});
