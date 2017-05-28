function funUsuarios()
{
	$("#tblUsuarios").crearDataTable("");
	usuarios_CargarUsuarios();
	usuarios_CargarEmpresas();	
	usuarios_CargarPerfiles();

	$("#frmCrearEmpresa").on("submit", function(evento)
		{
			evento.preventDefault();

			var Nombre = $("#txtCrearEmpresa_Nombre").val();
			var NIT = $("#txtCrearEmpresa_NIT").val();
			var Descripcion = $("#txtCrearEmpresa_Descripcion").val();
			var Telefono = $("#txtCrearEmpresa_Telefono").val();
			var Direccion = $("#txtCrearEmpresa_Direccion").val();

			if (Nombre == '')
			{
				Mensaje("Error", 'No es posible crear una empresa', 'danger');
			} else
			{
				$.post('../server/php/proyecto/configuracion_CrearEmpresa.php', 
				{
					Usuario : Usuario.id,
					Nombre : Nombre,
					NIT : NIT,
					Descripcion : Descripcion,
					Telefono : Telefono,
					Direccion : Direccion
				}, 
				function(data, textStatus, xhr) 
				{
					if (typeof(data) == 'object')
					{
						if (data.Error != '')
						{
							Mensaje("Error", data.Error, 'danger');
						} else
						{
							Mensaje("Hey", 'Se ha creado una nueva empresa', 'success');
							$(".txtEmpresa").append('<option value="' + data.id + '">' + Nombre + '</option>');
							$("#cntCrearEmpresa").modal('hide');
							$(".txtEmpresa").val(data.id);
							$("#frmCrearEmpresa")[0].reset();
						}
					} else
					{
						Mensaje("Error Crítico", data, 'cancel');
					}
				}, 'json');
			}
		});

	$("#btnUsuarios_CrearEmpresa").on("click", function(evento)
	{
		evento.preventDefault();

		$("#txtCrearEmpresa_Nombre").val('');
		$("#txtCrearEmpresa_NIT").val('');
		$("#txtCrearEmpresa_Descripcion").val('');

		$("#cntCrearEmpresa").modal('show');
	});

	$("#btnUsuarios_CrearUsuario").on("click", function()
	{
		$("#cntUsuarios_VerUsuarios").hide();
		$("#cntUsuarios_CrearUsuario").slideDown();
		$("#frmUsuarios_Crear")[0].reset();
		$("#txtUsuarios_Crear_idLogin").val("");
		$("#lblUsuarios_Crear_Tipo").text("Creación");
		$("#cntUsuarios_Crear_DatosUsuario .form-control").attr("disabled", false);
		$("#cntUsuarios_Crear_DatosSesion .form-control").attr("disabled", false);
	});

	$("#btnUsuarios_VerUsuarios").on("click", function()
	{
		$("#cntUsuarios_CrearUsuario").hide();
		$("#cntUsuarios_VerUsuarios").slideDown();

		usuarios_CargarUsuarios();
	});

	$(document).delegate('#tblUsuarios tbody button', 'click', function(event) 
	{
		$("#lblUsuarios_Crear_Tipo").text("Edición");

		var fila = $(this).parent("div").parent("td").parent("tr").find("td");
		$("#txtUsuarios_Crear_idLogin").val($(fila[1]).text());

		
		$("#txtUsuarios_Crear_Nombre").val($(fila[3]).text());
		$("#txtUsuarios_Crear_Cargo").val($(fila[4]).text());
		$("#txtUsuarios_Crear_idPerfil").val($(fila[5]).attr("idPerfil"));
		$("#txtUsuarios_Crear_Correo").val($(fila[6]).text());
		$("#txtUsuarios_Crear_idEmpresa").val($(fila[7]).attr("idEmpresa"));
		$("#txtUsuarios_Crear_Estado").val($(fila[8]).text());

		$("#txtUsuarios_Crear_nUsuario").val($(fila[2]).text());
		$("#txtUsuarios_Crear_Clave").val("laClaveEstaProtegida");
		$("#txtUsuarios_Crear_Clave2").val("laClaveEstaProtegida");

		$("#cntUsuarios_VerUsuarios").hide();
		$("#cntUsuarios_CrearUsuario").slideDown();
	});

	$(document).delegate('.btnUsuarios_EditarDatos', 'click', function(event) 
	{
		$("#cntUsuarios_Crear_DatosUsuario .form-control").attr("disabled", false);
		$("#cntUsuarios_Crear_DatosSesion .form-control").attr("disabled", true);
		
		$("#txtUsuarios_Crear_Correo").attr("disabled", true);
	});

	$(document).delegate('.btnUsuarios_EditarClave', 'click', function(event) 
	{
		$("#cntUsuarios_Crear_DatosUsuario .form-control").attr("disabled", true);
		$("#cntUsuarios_Crear_DatosSesion .form-control").attr("disabled", false);

		$("#txtUsuarios_Crear_nUsuario").attr("disabled", true);
	});	

	$("#frmUsuarios_Crear").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmUsuarios_Crear").generarDatosEnvio("txtUsuarios_Crear_", function(datos)
		{
			$.post('../server/php/proyecto/usuarios_crearUsuario.php', {datos : datos}, function(data, textStatus, xhr) 
			{
				if (data.Error != "")
				{
					Mensaje("Error", data.Error, "danger");
				} else
				{
					$("#txtUsuarios_Crear_idLogin").val(data.datos);
					Mensaje("Hey", "Los datos han sido ingresados", "success");
					if (typeof fichaTraje_CargarUsuarios == 'function')
					{
						fichaTraje_CargarUsuarios();	
					}
				}
			}, "json");
		});
	});
}

function usuarios_CargarUsuarios()
{
	$.post('../server/php/proyecto/usuarios_cargarUsuarios.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
	{
		if (data == 0)
		{
			Mensaje("Error", "No hay datos en la Tabla", "danger");
		} else
		{
			if (typeof(data) == "object")
			{
				var tds = "";
				$.each(data, function(index, val) 
				{
					tds += '<tr>';
	    				tds += '<td>';
	    					tds += '<div>';
	    						tds += '<button type="button" class="btn btn-icon btn-info btnUsuarios_EditarDatos"><i class="icon wb-edit" aria-hidden="true"></i></button>';
	    						tds += '<button type="button" class="btn btn-icon btn-warning btnUsuarios_EditarClave margin-left-5"><i class="icon wb-lock" aria-hidden="true"></i></button>';
	    					tds += '</div>';
	    				tds += '</td>';
	    				tds += '<td>' + val.id + '</td>';
	    				tds += '<td>' + val.Usuario + '</td>';
	    				tds += '<td>' + val.Nombre + '</td>';
	    				tds += '<td>' + val.Cargo + '</td>';
	    				tds += '<td idPerfil="' + val.idPerfil + '">' + val.Perfil + '</td>';
	    				tds += '<td>' + val.Correo + '</td>';
	    				tds += '<td idEmpresa="' + val.idEmpresa + '">' + val.Empresa + '</td>';
	    				tds += '<td>' + val.Estado + '</td>';
	    			tds += '</tr>';

				});
				
    			$("#tblUsuarios").crearDataTable(tds, function(){});
			} else
			{
				Mensaje("Error", data, "danger");
			}
		}
	}, "json");
}



function usuarios_CargarPerfiles()
{
	$("#txtUsuarios_Crear_idPerfil option").remove();
	$.post('../server/php/proyecto/configuracion_CargarPerfiles.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
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
				
    			$("#txtUsuarios_Crear_idPerfil").append(tds2);
			} else
			{
				Mensaje("Error", data, "danger");
			}
		}
	}, "json");
}

function usuarios_CargarEmpresas()
{
	$("#txtUsuarios_Crear_idEmpresa option").remove();
	$.post('../server/php/proyecto/configuracion_CargarEmpresas.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
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
	    			tds2 += '<option value="' + val.id + '">' + val.Nombre + ' (' + val.NIT + ')' + '</option>';
				});
				
    			$("#txtUsuarios_Crear_idEmpresa").append(tds2);
			} else
			{
				Mensaje("Error", data, "danger");
			}
		}
	}, "json");
}


