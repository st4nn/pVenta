<?php
   function datosUsuario($idUsuario)
   {
      $link = Conectar();
    
      $sql = "SELECT 
               Login.idLogin AS 'idLogin',
               Login.Usuario AS 'Usuario',
               Login.Estado AS 'Estado',
               Datos.Nombre AS 'Nombre',
               Datos.Correo AS 'Correo',
               Datos.Cargo AS 'Cargo',
               Datos.idPerfil AS 'idPerfil',
               Login.idEmpresa AS 'idEmpresa'
            FROM 
               Login AS Login
               INNER JOIN datosUsuarios AS Datos ON Datos.idLogin = Login.idLogin
            WHERE 
               Login.idLogin = $idUsuario";
      
      $result = $link->query($sql);

      if ( $result->num_rows > 0)
      {
         $Resultado = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            foreach ($row as $key => $value) 
            {
               $Resultado[$key] = utf8_encode($value);
            }
         }
            mysqli_free_result($result);  
            return $Resultado;
      } else
      {
         return 0;
      }
   }
?>