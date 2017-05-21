function funFichaTraje()
{
	fichaTraje_CargarUsuarios();
	$("#btnFichaTraje_Volver").on("click", function(evento)
	{
		evento.preventDefault();
		cargarModulo("trajes/verTrajes.html", 'Ver Trajes');
	});

	$("#tblFichaTraje_Inspecciones").crearDataTable("");
	$("#tblFichaTraje_Servicios").crearDataTable("");

	$("#lblFichaTraje_Usuario").text(Usuario.Nombre);
	$("#lblFichaTraje_Cargo").text(Usuario.Cargo);
	$("#lblFichaTraje_Empresa").text(Usuario.Empresa);

	$("#cntVerTraje_Archivos").iniciarObjArchivos({objPrefijo : $("#txtVerTrajes_Prefijo"), Proceso: "Trajes", Usuario: Usuario.id});

	$("#frmFichaTraje_Responsable").on("submit", function(evento)
	{
		evento.preventDefault();
		alertify.set({"labels" : {"ok" : "Si, Trasladar", "cancel" : "No, Volver"}});
      alertify.confirm("CConfirma que ese es el nuevo responsable?", function (ev) 
	      {
	        if (ev)
	        {
	          $.post('../server/php/proyecto/trajes_AsignarResponsable.php', 
	            {
	              Usuario: Usuario.id, 
	              idResponsable : $("#txtFichaTraje_Responsable").val(), 
	              Prefijo : $("#txtVerTrajes_Prefijo").val()
	            }, function(data, textStatus, xhr) 
	            {
	              if (data.Error != '')
	              {
	              	Mensaje("Error", data.Error, 'danger');
	              } else
	              {
	              	fichaTraje_CargarFicha($("#txtVerTrajes_Prefijo").val());
	              	verTrajes_cargarTrajes();
	              }
	            }, 'json');
	        } 
	      });
	});
}

function fichaTraje_CargarUsuarios()
{
	$("#txtFichaTraje_Responsable option").remove();
	$.post('../server/php/proyecto/usuarios_cargarUsuarios.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
	{
		if (data == 0)
		{
			Mensaje("Error", "No hay datos en la Tabla", "danger");
		} else
		{
			if (typeof(data) == "object")
			{
				var tds = '<option value="0">Ninguno</option>';
				$.each(data, function(index, val) 
				{
					tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
				});
				
    			$("#txtFichaTraje_Responsable").append(tds);
			} else
			{
				Mensaje("Error", 'No hay usuarios registrados', "danger");
			}
		}
	}, "json");
}