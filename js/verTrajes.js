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
		cargarModulo("trajes/crearTraje.html", "Crear Traje", function()
			{
				$.post('../server/php/proyecto/trajes_CargarInfoTraje.php', 
				{Usuario: Usuario.id, Prefijo : vPrefijo}, 
				function(data, textStatus, xhr) 
				{
					$.each(data.Datos, function(index, val) 
					{
						
					});
				}, 'json');
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