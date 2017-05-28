function funVerServicios()
{
	verServicios_cargarServicios();
}

var verServicios_cargarServicios = function ()
{
	$.post('../server/php/proyecto/servicios_cargarServicios.php', 
	{
		Usuario : Usuario.id
	}, 
	function(data, textStatus, xhr) 
	{
		$("#tblVerServicios tbody tr").remove();
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
					tds += '<td>' + val.TipoServicio + '</td>';
					tds += '<td>' + val.Descripcion + '</td>';
					tds += '<td>' + val.Garantia + '</td>';
					tds += '<td>' + val.fechaServicio + '</td>';
					tds += '<td>' + val.Detalles + '</td>';
				tds += '</tr>';
			});

			$("#tblVerServicios").crearDataTable(tds);

		} else
		{
			Mensaje("Hey", "Aún no hay Servicios creados", 'danger');
		}
	}, 'json');
}
