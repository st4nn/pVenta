<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $where = "";
   if ($Usuario['idPerfil'] > 1)
   {
      $where = " WHERE Trajes.idEmpresa = '" . $Usuario['idEmpresa']  . "'";
   }

   if ($Usuario['idPerfil'] == 3)
   {
      $where .= " AND Trajes.idBombero = '" . $idUsuario  . "'";
   }

   $sql = "SELECT
            trajes_Servicios.*,
            datosResponsable.Nombre AS 'Usuario',
            datosBombero.Nombre AS 'Bombero',
            Trajes.Serie,
            confTrajes_Productos.Nombre AS 'Producto',
            confTrajes_Normas.Nombre AS 'Norma',
            Empresas.Nombre AS 'Empresa'
          FROM
            trajes_Servicios
            INNER JOIN datosUsuarios AS datosResponsable ON trajes_Servicios.idUsuario = datosResponsable.idLogin
            LEFT JOIN datosUsuarios AS datosBombero ON trajes_Servicios.idBombero = datosBombero.idLogin
            INNER JOIN Trajes ON trajes_Servicios.idTraje = Trajes.Prefijo
            INNER JOIN confTrajes_Productos ON confTrajes_Productos.id = Trajes.idProducto
            INNER JOIN confTrajes_Normas ON confTrajes_Normas.id = Trajes.idNorma
            LEFT JOIN Empresas ON Empresas.id = Trajes.idEmpresa
         $where;";



   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>