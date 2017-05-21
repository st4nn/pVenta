<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Prefijo = addslashes($_POST['Prefijo']);

   $Usuario = datosUsuario($idUsuario);

   $Resultado = array('Datos' => 0, 'Inspecciones' => 0, 'Archivos' => 0, 'Error' => '');


   $sql = "SELECT
            Trajes.*,
            confTrajes_Normas.Nombre AS 'Norma',
            confTrajes_Productos.Nombre AS 'Producto'
          FROM
            Trajes
            INNER JOIN confTrajes_Productos ON confTrajes_Productos.id = Trajes.idProducto
            INNER JOIN confTrajes_Normas ON confTrajes_Normas.id = Trajes.idNorma
         WHERE
            Trajes.Prefijo = '$Prefijo';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado['Datos'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         foreach ($row as $key => $value) 
         {
            $Resultado['Datos'][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
   } 

   $sql = "SELECT
            Archivos.*,
            datosUsuarios.Nombre AS 'Usuario'
          FROM
            Archivos
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Archivos.idLogin
         WHERE
            Archivos.Prefijo = '$Prefijo';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado['Archivos'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['Archivos'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['Archivos'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
   } 
   
   echo json_encode($Resultado);
?>