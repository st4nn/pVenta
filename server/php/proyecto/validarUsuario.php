<?php
   include("../conectar.php"); 
   error_reporting(0);
   $link = Conectar();

   date_default_timezone_set('America/Bogota');

   $usuario = addslashes($_POST['pUsuario']);
   $clave = addslashes($_POST['pClave']);
   $Fecha = $_POST['pFecha'];
   
   $sql = "SELECT 
               Login.idLogin AS 'idLogin',
               Login.Usuario AS 'Usuario',
               Login.Estado AS 'Estado',
               Datos.Nombre AS 'Nombre',
               Datos.Correo AS 'Correo',
               Datos.Cargo AS 'Cargo',
               Datos.idPerfil AS 'idPerfil'
            FROM 
               Login AS Login,
               datosUsuarios AS Datos
            WHERE 
               Datos.idLogin = Login.idLogin
               AND Login.Usuario = '$usuario' 
               AND Login.Clave = '" . $clave . "';";

   $result = $link->query($sql);

   if ( $result->num_rows == 1)
   {
      class User
      {
         public $id;
         public $username;
         public $nombre;
         public $email;
         public $state;
         public $cDate;
         public $idUser;
         
         public $idPerfil;
         public $cargo;
      }
      

         $row = $result->fetch_assoc();
         $Users = new User();
         $Users->id = utf8_encode($row['idLogin']);
         $Users->username = utf8_encode($row['Usuario']);
         $Users->nombre = utf8_encode($row['Nombre']);
         $Users->email = utf8_encode($row['Correo']);
         $Users->state = utf8_encode($row['Estado']);
         $Users->cDate = $Fecha;
         $Users->idUser = utf8_encode($row['idLogin']);
         $Users->idPerfil = utf8_encode($row['idPerfil']);
         $Users->cargo = utf8_encode($row['Cargo']);

         mysqli_free_result($result);  
         echo json_encode($Users);
   } else
   {
      echo 0;
   }
?>