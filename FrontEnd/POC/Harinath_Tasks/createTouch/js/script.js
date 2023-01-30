$(document).ready(function(){

    $campaignTable = $('.campaignTable');



    //GET METHOD

    $.ajax({
        type:'GET',
        url:'../data/data.json',
        success : function(data){
            console.log(data.records);

            $.each(data.records,function(index,value){
               
                $campaignTable.append('<tr class="tableData_'+index+'"><td><input type="checkbox" class="row_selector_checkBox" id=row_'+value.unique_id+' ></td><td>'+value.touch_Name+'</td><td>'+value.channel+'</td><td>'+value.touch_date+'</td><td>'+value.unique_id+'</td><td>'+value.segment+'</td><td>'+value.Phone+'</td><td>'+value.url+'</td><td>'+value.language+'</td><td>'+value.status+'</td></tr>');
            });
        }
    });


    $('#row_selector_checkBox').each(function(){
        console.log(this)
    });
});