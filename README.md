# Remote Control

## Description

Ce projet est un projet de contrôle à distance du sons et des touches du clavier pour reculer, avancer, mettre en pause une vidéo, musique, etc...

## Utilisation
1. Lancement du serveur en windows (la désactivation de l'antivirus peut être nécessaire)
    ```
    .\dist\server-remote-control.exe
    ```
2. Une fois le serveur lancé, l'adresse est communiquée dans la console
    ```
    * Serving Flask app 'Flask'
    * Debug mode: off
      WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    * Running on http://192.168.100.150:5000
      Press CTRL+C to quit
    ```
   Ici l'adresse est `http://192.168.100.150:5000`


3. Entrer l'adresse dans n'importe quel navigateur connecté au même réseau que le serveur

Info: Le fichier .exe est indépendant, les fichiers du projet ne sont pas nécessaires pour le lancement du serveur (tout le reste peut être supprimé)