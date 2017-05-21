<?php
   include("../conectar.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Nombre = addslashes($_POST['Nombre']);
   $NIT = addslashes($_POST['NIT']);
   $Descripcion = addslashes($_POST['Descripcion']);
   $Telefono = addslashes($_POST['Telefono']);
   $Direccion = addslashes($_POST['Direccion']);

   $id = "NULL";

   date_default_timezone_set('America/Bogota');
   
   $fecha = date('Y-m-d h:i:s');
   $Respuesta = array('Error' => '', 'id' => 0);

   $sql = "INSERT INTO Empresas(Nombre, NIT, Descripcion, Telefono, Direccion) VALUES ('$Nombre', '$NIT', '$Descripcion', '$Telefono', '$Direccion');";
            
   $link->query(utf8_decode($sql));
   if ( $link->error == "")
   {
      $id = $link->insert_id;
      $Respuesta['id'] = $id;
   } else
   {
      $Respuesta['Error'] = $link->error;
   }

   echo json_encode($Respuesta);
?>