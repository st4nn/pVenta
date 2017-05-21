function funVerTrajes()
{
	verTrajes_cargarTrajes();
	$("#btnVerTrajes_CrearTraje").on("click", function(evento)
	{
		evento.preventDefault();
		cargarModulo("trajes/crearTraje.html", "Crear Traje", function()
			{
				$("#frmTrajes_Crear")[0].reset();
				$("#txtTrajes_Crear_Prefijo").val(obtenerPrefijo());
				$("#cntTraje_Archivos_DivArchivo_Listado li").remove();
			});
	});

	$(document).delegate('.btnVerTrajes_Editar', 'click', function(evento) 
	{
		evento.preventDefault();
		var vPrefijo = $(this).attr("Prefijo");
		cargarModulo("trajes/fichaTraje.html", "Ficha de Traje", function()
			{
				$("#txtVerTrajes_Prefijo").val(vPrefijo);
				
				fichaTraje_CargarFicha(vPrefijo);
			});
	});
}

function verTrajes_cargarTrajes()
{
	$.post('../server/php/proyecto/trajes_cargarTrajes.php', 
	{
		Usuario : Usuario.id
	}, 
	function(data, textStatus, xhr) 
	{
		$("#tblVerTrajes tbody tr").remove();
		if (data != 0)
		{
			var tds = '';
			$.each(data, function(index, val) 
			{
				tds += '<tr>';
					tds += '<td><button Prefijo="' + val.Prefijo + '" class="btn btn-info btnVerTrajes_Editar"><i class="icon wb-edit"></i></button></td>';
					tds += '<td>' + val.id + '</td>';
					tds += '<td>' + val.Usuario + '</td>';
					tds += '<td>' + val.Producto + '</td>';
					tds += '<td>' + val.Norma + '</td>';
					tds += '<td>' + val.Serie + '</td>';
					tds += '<td>' + val.Anio + '</td>';
					tds += '<td>' + val.Empresa + '</td>';
					tds += '<td>' + val.Bombero + '</td>';
					tds += '<td>' + val.fechaCargue + '</td>';
				tds += '</tr>';
			});

			$("#tblVerTrajes").crearDataTable(tds);

		} else
		{
			Mensaje("Hey", "Aún no hay trajes creados", 'danger');
		}
	}, 'json');
}

function fichaTraje_CargarFicha(vPrefijo)
{
	$.post('../server/php/proyecto/trajes_CargarInfoTraje.php', 
	{Usuario: Usuario.id, Prefijo : vPrefijo}, 
	function(data, textStatus, xhr) 
	{
		$("#tblFichaTraje_Informacion tbody tr").remove();
		if (data.Datos != 0)
		{
			var val = data.Datos;
			var tdsDatos = '';
			
			tdsDatos += '<tr>';
				tdsDatos += '<td idProducto="' + val.idProducto + '">' + val.Producto + '</td>';
				tdsDatos += '<td>' + val.Serie + '</td>';
				tdsDatos += '<td>' + val.Anio + '</td>';
				tdsDatos += '<td idNorma="' + val.idNorma + '">' + val.Norma + '</td>';
			tdsDatos += '</tr>';

			$("#txtFichaTraje_Responsable").val(val.idBombero);
			$("#tblFichaTraje_Informacion tbody").append(tdsDatos);
		}

		$("#tblFichaTraje_Inspecciones tbody tr").remove();
		if (data.Inspecciones != 0)
		{
			var val = data.Datos;
			var tdsDatos = '';
			
			tdsDatos += '<tr>';
				tdsDatos += '<td>' + val.Inspeccion + '</td>';
				tdsDatos += '<td>' + val.Descripcion + '</td>';
				tdsDatos += '<td>' + val.Fecha_bajo_Norma + '</td>';
				tdsDatos += '<td>' + val.Fecha_Final_Inspeccion + '</td>';
				tdsDatos += '<td>' + val.Detalles_de_Inspeccion + '</td>';
			tdsDatos += '</tr>';

			$("#tblFichaTraje_Inspecciones tbody").append(tdsDatos);
		}

		$("#tblFichaTraje_Servicios tbody tr").remove();
		if (data.Servicios != 0)
		{
			var val = data.Servicios;
			var tdsServicios = '';
			
			tdsServicios += '<tr>';
				tdsServicios += '<td>' + val.Servicio + '</td>';
				tdsServicios += '<td>' + val.Descripcion + '</td>';
				tdsServicios += '<td>' + val.Fecha_Servicio + '</td>';
				tdsServicios += '<td>' + val.Garantia + '</td>';
				tdsServicios += '<td>' + val.Detalles_de_Servicio + '</td>';
			tdsServicios += '</tr>';

			$("#tblFichaTraje_Inspecciones tbody").append(tdsDatos);
		}

		$("#cntVerTraje_Archivos_DivArchivo_Listado li").remove();
		if (data.Archivos != 0)
		{
			
			var tdsArchivos = '';
			$.each(data.Archivos, function(index, val) 
			{
                tdsArchivos += '<li class="list-group-item">';
                  tdsArchivos += '<small>';
                    tdsArchivos += '<time class="pull-right" datetime="' + val.fechaCargue + '">' + calcularTiempoPublicacion(val.fechaCargue) + '</time><br>';
                  tdsArchivos += '</small>';
                  tdsArchivos += '<p><a class="hightlight" href="../server/php/' + val.Ruta + '/' + val.Nombre + '" target="_blank">' + val.Nombre + '</a></p>';
                  tdsArchivos += '<p>' + val.Observaciones + '</p>';
                  tdsArchivos += '<small>Cargado por ';
                    tdsArchivos += '<a class="hightlight" href="javascript:void(0)">';
                      tdsArchivos += '<span> ' + val.Usuario + '</span>';
                    tdsArchivos += '</a>';
                  tdsArchivos += '</small>';
                tdsArchivos += '</li>';
			});

			$("#cntVerTraje_Archivos_DivArchivo_Listado").append(tdsArchivos);
		}
	}, 'json');
}