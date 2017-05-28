<?php
   include("../conectar.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Responsable = addslashes($_POST['idResponsable']);
   $fechaDiligenciada = addslashes($_POST['fechaDiligenciada']);
   $Prefijo = addslashes($_POST['Prefijo']);

   $Usuario = datosUsuario($Responsable);
   $idEmpresa = $Usuario['idEmpresa'];

   date_default_timezone_set('America/Bogota');
   
   $fecha = date('Y-m-d h:i:s');
   $Respuesta = array('Error' => '', 'id' => 0);

   $sql = "UPDATE Trajes SET idBombero = '$Responsable', idEmpresa = '$idEmpresa' WHERE Prefijo = '$Prefijo';";
            
   $link->query(utf8_decode($sql));
   if ( $link->error == "")
   {
      $id = $link->insert_id;
      $sql = "INSERT INTO trajes_Asignaciones(idUsuario, idTraje, idBombero, fechaDiligenciada) VALUES 
      (
         '$idUsuario',
         '$Prefijo',
         '$Responsable',
         '$fechaDiligenciada'
      );";
      $link->query(utf8_decode($sql));
      $Respuesta['id'] = $id;
   } else
   {
      $Respuesta['Error'] = $link->error;
   }

   echo json_encode($Respuesta);
?>