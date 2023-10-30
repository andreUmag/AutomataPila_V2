$(document).ready(function(){
    $("#add-word").click(function(){
        var register = $("#input-word").val();
        if(register){
            var comentHTML = '<li class="list-register">'+register+'</li>'
            $("#history_list").prepend(comentHTML);
            $("#input-word").val("");

            var data = {
                word : register
            }

            $.ajax({
                url:'/post',
                type:'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(response){
                    console.log("GURDADO");
                },
                error: function(error){
                    console.error("NO SE GUARDO")
                }
            })
        }
    })
});

$(document).ready(function () {
    // Cuando se hace clic en el enlace "History"
    $("#history a").click(function (e) {
      e.preventDefault(); // Evita que el enlace recargue la página

      // Muestra u oculta la lista desplegable
      $("#history_list").slideToggle();
    });

    // Hacer una solicitud AJAX y agregar elementos a la lista
    $.ajax({
      url: '/get',
      type: 'GET',
      success: function (registers) {
        registers.forEach(function (register) {
          var comentHTML = '<li class="list-register">' + register.word + '</li>';
          $("#history_list").append(comentHTML);
        });
      },
      error: function (error) {
        console.error("Error");
      }
    });
  });