<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $Perfil = "";
   if ($Usuario['idPerfil'] > 1)
   {
      $Perfil = " WHERE Empresas.id = '" . $Usuario['idEmpresa'] . "' OR Empresas.id IS NULL";
   }

   $sql = "SELECT
            Empresas.*
          FROM
            Empresas
         $Perfil
            ORDER BY
               Empresas.Nombre;";

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