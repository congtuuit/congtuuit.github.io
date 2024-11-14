# .Net build with variable guide (.Net 7+)

## 1. Create appsettings file for env, example:

```
appsettings.json
appsettings.Development.json
appsettings.Production.json
```

## 2. Add new code into Program.cs
- `"appsettings.json"`: This is the main configuration file for the application, typically containing common settings for the app.
- `optional: false`: This parameter specifies that this configuration file is required. If the file does not exist, the application will throw an exception and fail to start.
- `reloadOnChange: true`: When set to true, the application will automatically reload the configuration file if any changes are detected. This allows the application to update its configuration without needing a restart.

```
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
```

## 3. Update web API project
- For Debug configurations, it includes both `appsettings.json` and `appsettings.Development.json` (both published) but removes any `appsettings.*.json` files from the publish output to avoid including unnecessary files.
- For non-Debug configurations (like Production), it includes `appsettings.json` (not published) and `appsettings.Production.json` (published).
```
<Choose>
  <When Condition="'$(Configuration)' != 'Debug'">
    <ItemGroup>
      <None Include="appsettings.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Never" />
      <None Include="appsettings.Production.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
    </ItemGroup>
  </When>
  <Otherwise>
    <ItemGroup>
      <None Include="appsettings.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
      <None Include="appsettings.Development.json" CopyToOutputDirectory="Always" CopyToPublishDirectory="Always" />
      <Content Remove="appsettings.*.json;appsettings.json" />
    </ItemGroup>
  </Otherwise>
</Choose>
```
