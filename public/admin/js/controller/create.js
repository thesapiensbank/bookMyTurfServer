
$('#submitbt1').click(function(){  
    alert("alert")
    var divElem = document.getElementById("mainForm");
    var inputElements = divElem.querySelectorAll("input, select, checkbox, textarea");
    alert($("#datetimepickerid").data("DateTimePicker").date())
    console.log(inputElements);
    //  $.ajax({ 
    //     url: '/ajax',
    //     type: 'POST',
    //     cache: false, 
    //     data: { field1: 1, field2: 2 }, 
    //     success: function(data){
    //        alert('Success!')
    //     }
    //     , error: function(jqXHR, textStatus, err){
    //         alert('text status '+textStatus+', err '+err)
    //     }
    //  })
  });  