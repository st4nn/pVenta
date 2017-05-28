<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Prefijo = addslashes($_POST['Prefijo']);

   $Usuario = datosUsuario($idUsuario);

   $Resultado = array('Datos' => 0, 'Inspecciones' => 0, 'Archivos' => 0, 'Servicios' => 0,'Error' => '');


   $sql = "SELECT
            Trajes.*,
            confTrajes_Normas.Nombre AS 'Norma',
            confTrajes_Productos.Nombre AS 'Producto',
            trajes_Asignaciones.fechaDiligenciada
          FROM
            Trajes
            INNER JOIN confTrajes_Productos ON confTrajes_Productos.id = Trajes.idProducto
            INNER JOIN confTrajes_Normas ON confTrajes_Normas.id = Trajes.idNorma
            LEFT JOIN trajes_Asignaciones ON trajes_Asignaciones.idTraje = Trajes.Prefijo AND trajes_Asignaciones.fechaCargue IN (SELECT MAX(fechaCargue) FROM trajes_Asignaciones WHERE Prefijo = '$Prefijo')
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

   $sql = "SELECT
            trajes_Inspecciones.*,
            confTrajes_TipoInspeccion.Nombre AS 'TipoDeInspeccion'
          FROM
            trajes_Inspecciones
            INNER JOIN confTrajes_TipoInspeccion ON confTrajes_TipoInspeccion.id = trajes_Inspecciones.idTipoInspeccion
         WHERE
            trajes_Inspecciones.idTraje = '$Prefijo';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado['Inspecciones'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['Inspecciones'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['Inspecciones'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
   } 

   $sql = "SELECT
            trajes_Servicios.*
          FROM
            trajes_Servicios
         WHERE
            trajes_Servicios.idTraje = '$Prefijo';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado['Servicios'] = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado['Servicios'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado['Servicios'][$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
   } 
   
   echo json_encode($Resultado);
?>