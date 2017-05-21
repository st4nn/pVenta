<?php
   include("../conectar.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Nombre = addslashes($_POST['Nombre']);

   date_default_timezone_set('America/Bogota');
   
   $fecha = date('Y-m-d h:i:s');
   $Respuesta = array('Error' => '', 'id' => 0);

   $sql "SELECT * FROM confTrajes_Normas WHERE Nombre = '$Nombre';";
   $result = $link->query(utf8_decode($sql));

   if ($result->num_rows > 0)
   {
      $Respuesta['Error'] = 'Ya existe una norma con ese nombre';
   } else
   {
      $sql = "INSERT INTO confTrajes_Normas(Nombre, idLogin) VALUES ('$idUsuario', '$Nombre');";
               
      $link->query(utf8_decode($sql));
      if ( $link->error == "")
      {
         $id = $link->insert_id;
         $Respuesta['id'] = $id;
      } else
      {
         $Respuesta['Error'] = $link->error;
      }
   }


   echo json_encode($Respuesta);
?>