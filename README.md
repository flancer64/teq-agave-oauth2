# @flancer64/teq-agave-oauth2

## Description

`@flancer64/teq-agave-oauth2` is a plugin for **Tequila Framework (TeqFW)** that enables applications to act as **OAuth2
providers**, managing client authentication and access control.

The plugin handles OAuth2 client registration, token issuance, and permission management but **does not perform user
authentication or registration**, relying on other TeqFW plugins for these tasks. It integrates with the **IoC container
**, allowing seamless interaction with other components in the framework.

## Features

- **OAuth2 client management**, including registration and permission configuration.
- **Access and refresh token issuance**, with built-in validation and lifecycle management.
- **Scope-based access control**, defining granular permissions for clients.
- **Integration with TeqFW’s IoC container**, ensuring flexible dependency management.
- **Template support for authentication pages**, enabling UI customization.

This plugin provides a **lightweight and scalable** OAuth2 implementation, making it an essential tool for applications
requiring secure authorization flows within **TeqFW**.
