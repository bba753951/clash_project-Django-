

$('#example').DataTable({
    "data": tdata,
    "destroy":true,
    "columns":[
        {"title":"Transcript Name"},
        {"title":"Number of sites"},
        {"title":"More Info"}
    ],
    "aoColumnDefs":[
        {
            "aTargets":[-1],
            "mData": function ( source, type, val  ) {return source},
            "mRender" : function(data,type,full){
                var value;
                if(data[1]+""==="0")
                    value = "show target site"
                else
                    value = '<a target="_blank" href="'+site_link+"?name="+data[0]+"&regulator="+regulator_name+"&userID="+userID+"&way="+way+'&mtype=transcript&sfile=ori_reg">show target site</a>';
                return value
            }
        }
    ],
    "order": [[ 1, 'desc'  ]]

});
