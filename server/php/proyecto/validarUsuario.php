<?php
   include("../conectar.php"); 
   error_reporting(0);
   $link = Conectar();

   date_default_timezone_set('America/Bogota');

   $usuario = addslashes($_POST['pUsuario']);
   $clave = addslashes($_POST['pClave']);
   $Fecha = $_POST['pFecha'];
   
   $sql = "SELECT 
               Login.idLogin AS 'id',
               Login.Usuario AS 'Usuario',
               Login.Estado AS 'Estado',
               Datos.Nombre AS 'Nombre',
               Datos.Correo AS 'Correo',
               Datos.Cargo AS 'Cargo',
               Datos.idPerfil AS 'idPerfil',
               Login.idEmpresa AS 'idEmpresa',
               Empresas.Nombre AS 'Empresa'
            FROM 
               Login AS Login
               LEFT JOIN Empresas ON Login.idEmpresa = Empresas.id
               INNER JOIN datosUsuarios AS Datos ON Login.idLogin = Datos.idLogin
            WHERE 
               Login.Usuario = '$usuario' 
               AND Login.Clave = '" . $clave . "';";

   $result = $link->query($sql);

   if ( $result->num_rows == 1)
   {
      $idx = 0;
      
         $Resultado = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            foreach ($row as $key => $value) 
            {
               $Resultado[$key] = utf8_encode($value);
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