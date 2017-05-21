function funCrearTraje()
	{
		$("#txtTrajes_Crear_Prefijo").val(obtenerPrefijo());
		$("#cntTraje_Archivos").iniciarObjArchivos({objPrefijo : $("#txtTrajes_Crear_Prefijo"), Proceso: "Trajes", Usuario: Usuario.id});

		$("#btnTrajes_CrearNorma").on("click", function(evento)
		{
			$("#cntCrearNorma").modal("show");
		});

		$("#frmCrearNorma").on("submit", function(evento)
		{
			evento.preventDefault();
			var Nombre = $("#txtCrearNorma_Nombre").val();
			if (Nombre == '')
			{
				Mensaje("Error", 'No es posible crear una Norma sin el nombre', 'danger');
			} else
			{
				$.post('../server/php/proyecto/configuracion_CrearNorma.php', 
				{
					Usuario : Usuario.id,
					Nombre : Nombre
				}, 
				function(data, textStatus, xhr) 
				{
					if (data.Error != '')
					{
						Mensaje("Error", data, 'danger');
					} else
					{
						Mensaje("Hey", 'Se ha creado una nueva Norma', 'success');
						$(".txtNorma").append('<option value="' + data.id + '">' + Nombre + '</option>');
						$("#frmCrearNorma")[0].reset();
						$("#cntCrearNorma").modal('hide');
					}
				}, 'json');
			}
		});

		$("#frmTrajes_Crear").on("submit", function(evento)
		{
			evento.preventDefault();

			$("#frmTrajes_Crear").generarDatosEnvio('txtTrajes_Crear_', function(datos)
			{
				$.post('../server/php/proyecto/trajes_CrearTraje.php', 
				{
					datos : datos,
					Usuario : Usuario.id
				}, function(data, textStatus, xhr) 
				{
					if (typeof(data) == 'object')
					{
						if (data.Error != '')
						{
							Mensaje("Error", data.Error, 'danger');
						} else
						{
							Mensaje("Hey", 'Se ha creado unn nuevo registro de traje', 'success');
							$("#frmTrajes_Crear")[0].reset();
							$("#txtTrajes_Crear_Prefijo").val(obtenerPrefijo());
						}
					} else
					{
						Mensaje("Error Crítico", data, 'cancel');
					}
				}, 'json');
			});
		});

		trajes_CargarNormas();
		trajes_CargarProductos();

		$("#txtTrajes_Crear_Anio").datepicker({
			autoclose: true,
			format: " yyyy", // Notice the Extra space at the beginning
		    viewMode: "years", 
		    minViewMode: "years"
		});
	}

	function trajes_CargarNormas()
	{
		$("#txtTrajes_Crear_idNorma option").remove();
		$.post('../server/php/proyecto/trajes_CargarNormas.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
		{
			if (data == 0)
			{
				Mensaje("Error", "No hay datos en la Tabla", "danger");
			} else
			{
				if (typeof(data) == "object")
				{
					var tds = "";
					var tds2 = "";
					
					$.each(data, function(index, val) 
					{
		    			tds2 += '<option value="' + val.id + '">' + val.Nombre + '</option>';
					});
					
	    			$("#txtTrajes_Crear_idNorma").append(tds2);
				} else
				{
					Mensaje("Error", data, "danger");
				}
			}
		}, "json");
	}

	function trajes_CargarProductos()
	{
		$("#txtTrajes_Crear_idProducto option").remove();
		$.post('../server/php/proyecto/trajes_CargarProductos.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
		{
			if (data == 0)
			{
				Mensaje("Error", "No hay datos en la Tabla", "danger");
			} else
			{
				if (typeof(data) == "object")
				{
					var tds = "";
					var tds2 = "";
					
					$.each(data, function(index, val) 
					{
		    			tds2 += '<option value="' + val.id + '">' + val.Nombre + '</option>';
					});
					
	    			$("#txtTrajes_Crear_idProducto").append(tds2);
				} else
				{
					Mensaje("Error", data, "danger");
				}
			}
		}, "json");
	}