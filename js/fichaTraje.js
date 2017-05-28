function funFichaTraje()
{
	fichaTraje_CargarUsuarios();
	fichaTraje_CargarTiposDeInspeccion();

	$(".datepicker").val(obtenerFecha().substring(0, 10));
	$(".datepicker").datepicker({
		autoclose: true
	});
	$("#btnFichaTraje_Volver").on("click", function(evento)
	{
		evento.preventDefault();
		cargarModulo("trajes/verTrajes.html", 'Ver Trajes');
	});

	$("#lblFichaTraje_Usuario").text(Usuario.Nombre);
	$("#lblFichaTraje_Cargo").text(Usuario.Cargo);
	$("#lblFichaTraje_Empresa").text(Usuario.Empresa);

	$("#txtCrearInspeccion_idTipoInspeccion").on("change", function()
	{
		var seleccionado = $("#txtCrearInspeccion_idTipoInspeccion option:selected");
		var dias = parseInt($(seleccionado).attr("data-dias"));
		var obligatorio = parseInt($(seleccionado).attr("data-obligatoria"));

		if (obligatorio != 1)
		{
			$("#txtCrearInspeccion_fechaBajoNorma").val('N/A');
		} else
		{
			$("#txtCrearInspeccion_fechaBajoNorma").val(sumarDias($("#txtFichaTraje_fechaDiligenciada").val(), dias));
		}
	});

	$("#txtCrearInspeccion_fechaFinalInspeccion").on("change", function()
	{
		$("#txtCrearInspeccion_idTipoInspeccion").trigger('change');
	});

	$("#btnFichaTraje_Inspeccion").on("click", function(evento)
	{
		evento.preventDefault();
		if ($("#txtFichaTraje_fechaDiligenciada").val() != '' && $("#txtFichaTraje_Responsable").val() != '0')
		{
			$("#frmCrearInspeccion")[0].reset();
			$("#txtCrearInspeccion_fechaFinalInspeccion").val(obtenerFecha().substring(0, 10));
			$("#cntCrearInspeccion").modal('show');
		} else
		{
			Mensaje("Error", 'No puedes crear Inspecciones a un traje sin Asignar');
		}
	});

	$("#btnFichaTraje_Servicio").on("click", function(evento)
	{
		evento.preventDefault();
		if ($("#txtFichaTraje_fechaDiligenciada").val() != '' && $("#txtFichaTraje_Responsable").val() != '0')
		{
			$("#frmCrearServicio")[0].reset();
			$("#txtCrearServicio_fechaServicio").val(obtenerFecha().substring(0, 10));
			$("#cntCrearServicio").modal('show');
		} else
		{
			Mensaje("Error", 'No puedes crear Servicios a un traje sin Asignar');
		}

	});

	$("#cntVerTraje_Archivos").iniciarObjArchivos({objPrefijo : $("#txtVerTrajes_Prefijo"), Proceso: "Trajes", Usuario: Usuario.id});

	$("#frmFichaTraje_Responsable").on("submit", function(evento)
	{
		evento.preventDefault();
		if ($("#txtFichaTraje_fechaDiligenciada").val() == "")
		{
			Mensaje("Error", 'Primero debes seleccionar la fecha de entrega', "danger");
		} else
		{
			alertify.set({"labels" : {"ok" : "Si, Trasladar", "cancel" : "No, Volver"}});
	     	alertify.confirm("Confirma que has seleccionado al nuevo responsable y que la fecha de entrega es " + $("#txtFichaTraje_fechaDiligenciada").val() + "?", function (ev) 
		      {
		        if (ev)
		        {
		          $.post('../server/php/proyecto/trajes_AsignarResponsable.php', 
		            {
		              Usuario: Usuario.id, 
		              idResponsable : $("#txtFichaTraje_Responsable").val(), 
		              fechaDiligenciada : $("#txtFichaTraje_fechaDiligenciada").val(),
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
		}
	});

	$("#frmCrearInspeccion").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmCrearInspeccion").generarDatosEnvio('txtCrearInspeccion_', function(datos)
		{
			$.post('../server/php/proyecto/trajes_CrearInspeccion.php', 
			{
				datos : datos,
				idUsuario : Usuario.id,
				Prefijo : $("#txtVerTrajes_Prefijo").val(),
				idBombero : $("#txtFichaTraje_Responsable").val()
			}, function(data, textStatus, xhr) 
			{
				if (typeof(data) == 'object')
				{
					if (data.Error != '')
					{
						Mensaje("Error", data.Error, 'danger');
					} else
					{
						fichaTraje_CargarFicha($("#txtVerTrajes_Prefijo").val());
						$("#cntCrearInspeccion").modal('hide');
						if (typeof verInspecciones_cargarInspecciones == 'function')
						{
							verInspecciones_cargarInspecciones();
						}
					}
				} else
				{
					Mensaje("Error Crítico", data, 'cancel');
				}
			}, 'json');
		});
	});

	$("#frmCrearServicio").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmCrearServicio").generarDatosEnvio('txtCrearServicio_', function(datos)
		{
			$.post('../server/php/proyecto/trajes_CrearServicio.php', 
			{
				datos : datos,
				idUsuario : Usuario.id,
				Prefijo : $("#txtVerTrajes_Prefijo").val(),
				idBombero : $("#txtFichaTraje_Responsable").val()
			}, function(data, textStatus, xhr) 
			{
				if (typeof(data) == 'object')
				{
					if (data.Error != '')
					{
						Mensaje("Error", data.Error, 'danger');
					} else
					{
						fichaTraje_CargarFicha($("#txtVerTrajes_Prefijo").val());
						$("#cntCrearServicio").modal('hide');

						if (typeof verServicios_cargarServicios == 'function')
						{
							verServicios_cargarServicios();
						}
					}
				} else
				{
					Mensaje("Error Crítico", data, 'cancel');
				}
			}, 'json');
		});
	});
}

var fichaTraje_CargarUsuarios = function ()
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
				if ($("#txtFichaTraje_tmpResponsable").length > 0)
				{
					$("#txtFichaTraje_Responsable").val($("#txtFichaTraje_tmpResponsable").val());
					$("#txtFichaTraje_tmpResponsable").remove();
				}
			} else
			{
				Mensaje("Error", 'No hay usuarios registrados', "danger");
			}
		}
	}, "json");
}

function fichaTraje_CargarTiposDeInspeccion()
{
	$("#txtCrearInspeccion_idTipoInspeccion option").remove();
	$.post('../server/php/proyecto/configuracion_CargarTiposDeInspeccion.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
	{
		if (data == 0)
		{
			Mensaje("Error", "No hay datos en la Tabla", "danger");
		} else
		{
			if (typeof(data) == "object")
			{
				var tds = '<option value="">Ninguno</option>';
				$.each(data, function(index, val) 
				{
					tds += '<option value="' + val.id + '" data-obligatoria="' + val.Obligatoria + '" data-dias="' + val.dias + '">' + val.Nombre + '</option>';
				});
				
    			$("#txtCrearInspeccion_idTipoInspeccion").append(tds);
    			$("#txtCrearInspeccion_idTipoInspeccion").trigger('change');
			} else
			{
				Mensaje("Error", 'No hay Tipos de Inspeccion registrados', "danger");
			}
		}
	}, "json");
}