function funVerInspecciones()
{
	verInspecciones_cargarInspecciones();
}

var verInspecciones_cargarInspecciones = function ()
{
	$.post('../server/php/proyecto/inspecciones_cargarInspecciones.php', 
	{
		Usuario : Usuario.id
	}, 
	function(data, textStatus, xhr) 
	{
		$("#tblVerInspecciones tbody tr").remove();
		if (data != 0)
		{
			var tds = '';
			$.each(data, function(index, val) 
			{
				tds += '<tr>';
					tds += '<td>' + val.id + '</td>';
					tds += '<td>' + val.Empresa + '</td>';
					tds += '<td>' + val.Bombero + '</td>';
					tds += '<td>' + val.Usuario + '</td>';
					tds += '<td>' + val.fechaCargue + '</td>';
					tds += '<td>' + val.Producto + '</td>';
					tds += '<td>' + val.Norma + '</td>';
					tds += '<td>' + val.Serie + '</td>';
					tds += '<td>' + val.TipoInspeccion + '</td>';
					tds += '<td>' + val.Descripcion + '</td>';
					tds += '<td>' + val.fechaBajoNorma + '</td>';
					tds += '<td>' + val.fechaFinalInspeccion + '</td>';
					tds += '<td>' + val.Detalles + '</td>';
				tds += '</tr>';
			});

			$("#tblVerInspecciones").crearDataTable(tds);

		} else
		{
			Mensaje("Hey", "Aún no hay trajes creados", 'danger');
		}
	}, 'json');
}

function fichaTraje_CargarFicha(vPrefijo)
{
	$("#tblFichaTraje_Inspecciones").destruirDataTable();
	$("#tblFichaTraje_Servicios").destruirDataTable();
	
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

			$("#txtFichaTraje_tmpResponsable").val(val.idBombero);
			$("#txtFichaTraje_Responsable").val(val.idBombero);
			$("#txtFichaTraje_fechaDiligenciada").val(val.fechaDiligenciada);
			$("#tblFichaTraje_Informacion tbody").append(tdsDatos);
		}

		$("#tblFichaTraje_Inspecciones tbody tr").remove();
		if (data.Inspecciones != 0)
		{
			var tdsInspecciones = '';

			$.each(data.Inspecciones, function(index, val) 
			{
				tdsInspecciones += '<tr>';
					tdsInspecciones += '<td>' + val.TipoDeInspeccion + '</td>';
					tdsInspecciones += '<td>' + val.Descripcion + '</td>';
					tdsInspecciones += '<td>' + val.fechaBajoNorma + '</td>';
					tdsInspecciones += '<td>' + val.fechaFinalInspeccion + '</td>';
					tdsInspecciones += '<td>' + val.Detalles + '</td>';
				tdsInspecciones += '</tr>';
			});


			

			$("#tblFichaTraje_Inspecciones").append(tdsInspecciones);
		}

		$("#tblFichaTraje_Servicios tbody tr").remove();
		if (data.Servicios != 0)
		{
			var tdsServicios = '';

			$.each(data.Servicios, function(index, val) 
			{
				tdsServicios += '<tr>';
					tdsServicios += '<td>' + val.TipoServicio + '</td>';
					tdsServicios += '<td>' + val.Descripcion + '</td>';
					tdsServicios += '<td>' + val.fechaServicio + '</td>';
					tdsServicios += '<td>' + val.Garantia + '</td>';
					tdsServicios += '<td>' + val.Detalles + '</td>';
				tdsServicios += '</tr>';
			});
			

			$("#tblFichaTraje_Servicios").append(tdsServicios);
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