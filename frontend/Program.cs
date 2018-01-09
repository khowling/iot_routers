using System;
using System.IO; // Path, Directory
using System.Net; // GetHostname
using System.Runtime.InteropServices; // RuntimeInformation
using System.Threading; // for CancellationToken
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Hosting; // required for "WebHostBuilder"
using Microsoft.AspNetCore.Builder; // required for the "Run" extension method on the Application class
using Microsoft.AspNetCore.Http; // required for "WriteAsync"
using Microsoft.AspNetCore.Server.Kestrel; // required for the "UseKestrel" extension method on the WebHost class
using System.Net.WebSockets; // required for WebSockets
//using Microsoft.Azure.Documents;
//using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;

using Microsoft.Extensions.Configuration; // for App Insghts JOSN configuration provider


namespace frontend
{
    class Program
    {
        private static object[][] UK_Towns = new object[][] {
            new object[]{ "Lerwick, Shetland, UK",60.152988,-1.149293},
            new object[]{ "Maidstone, Kent, UK",51.272644,0.52527},
            new object[]{ "Dunfermline, Scotland, UK",56.071739,-3.452151},
            new object[]{ "Capel Curig, Betws-y-Coed, the UK",53.106152,-3.91236},
            new object[]{ "Queensferry, Scotland, the UK",55.992622,-3.409195},
            new object[]{ "Braintree, Essex, England",51.876534,0.553436},
            new object[]{ "Stroud, Gloucestershire, UK",51.745735,-2.217758},
            new object[]{ "Hunterston, North Ayrshire, UK",55.723331,-4.898329},
            new object[]{ "Ivybridge, Devon, UK",50.390202,-3.920431},
            new object[]{ "Aberystwyth, Ceredigion, SY, UK",52.415089,-4.083116},
            new object[]{ "Llanrwst, Conwy, North Wales",53.137032,-3.795732},
            new object[]{ "Chalton, Central Bedfordshire, UK",51.925957,-0.500873},
            new object[]{ "Cannock, Staffordshire, UK",52.69994,-2.021829},
            new object[]{ "Cambuslang, Glasgow, South Lanarkshire, UK",55.81879,-4.167187},
            new object[]{ "Marlow, Windsor and Maidenhead, UK",51.572803,-0.776339},
            new object[]{ "Dukinfield, Tameside, UK",53.478764,-2.094523},

            new object[]{ "South Benfleet, Essex, UK",51.56736,0.550539},
            new object[]{ "Minions, Liskeard, Cornwall, UK",50.514999,-4.45394},
            new object[]{ "Caerwnon Park, Builth Wells, Powys, UK",52.179485,-3.440298},
            new object[]{ "Redruth, Cornwall, UK",50.233021,-5.226666},
            new object[]{ "Sawston, Cambridge, Cambridgeshire, UK",52.122665,0.169775},
            new object[]{ "Brierley Hill, West Midlands, UK",52.482533,-2.121166},
            new object[]{ "Cheadle, Stoke-on-Trent, Staffordshire, UK",52.986115,-1.986144},
            new object[]{ "Dorchester, Dorset, UK",50.711163,-2.441181},
            new object[]{ "Bo'ness, West Lothian, UK",56.013035,-3.603531},
            new object[]{ "Alton, Hampshire, UK",51.150719,-0.973177},
            new object[]{ "Littleport, Ely, Cambridgeshire, UK",52.45665,0.307016},
            new object[]{ "Balloch, West Dunbartonshire, UK",56.002716,-4.580081},

            new object[]{ "Stone, Staffordshire, UK",52.906002,-2.147913},
            new object[]{ "Beverley, East Riding of Yorkshire , UK",53.841965,-0.435093},
            new object[]{ "Harringay, London, UK",51.581551,-0.099649},
            new object[]{ "Wem, Shrewsbury, Shropshire, UK",52.853638,-2.726712},
            new object[]{ "Dalnatrat, Appin, Highland, UK",56.62674,-5.313209},
            new object[]{ "Send Marsh, Surrey, UK",51.29134,-0.513182},
            new object[]{ "Anlaby, Hull, East Riding of Yorkshire, UK",53.745766,-0.432844},
            new object[]{ "Tring, Hertfordshire, UK",51.796078,-0.655879},
            new object[]{ "Hathersage, Hope Valley, Derbyshire, UK",53.330009,-1.656355},
            new object[]{ "Chatteris, Cambridgeshire, UK",52.4561,0.054012},
            new object[]{ "Penryn, Cornwall, UK",50.169174,-5.107088},
            new object[]{ "Edmonton, London, UK",51.61359,-0.062553},
            new object[]{ "Baberton, Edinburgh, City of Edinburgh, UK",55.908749,-3.288481},
            new object[]{ "Wallasey, Merseyside, UK",53.426521,-3.066215},
            new object[]{ "Richmond, North Yorkshire, UK",54.403465,-1.732618},
            new object[]{ "Wigan, Wigan, UK",53.545067,-2.632507},
            new object[]{ "Elgin, Scotland, the UK",57.653484,-3.335724},

            new object[]{ "Stoke-on-Trent, Staffordshire, the UK",53.002666,-2.179404},
            new object[]{ "Solihull, Birmingham, UK",52.412811,-1.778197},
            new object[]{ "Cardiff, Cardiff county, UK",51.481583,-3.17909},
            new object[]{ "Eastbourne, East Sussex, UK",50.768036,0.290472},
            new object[]{ "Oxford, Oxfordshire, UK",51.752022,-1.257677},
            new object[]{ "London, UK",51.509865,-0.118092},
            new object[]{ "Swindon, Swindon, UK",51.568535,-1.772232},
            new object[]{ "Gravesend, Kent, UK",51.441883,0.370759},
            new object[]{ "Northampton, Northamptonshire, UK",52.240479,-0.902656},
            new object[]{ "Rugby, Warwickshire, UK",52.370876,-1.265032},
            new object[]{ "Sutton Coldfield, West Midlands, UK",52.570385,-1.824042},
            new object[]{ "Harlow, Essex, UK",51.772938,0.10231},
            new object[]{ "Aberdeen, Aberdeen City, UK",57.149651,-2.099075},
            new object[]{ "Swansea, Swansea, UK",51.621441,-3.943646},
            new object[]{ "Chesterfield, Derbyshire, UK",53.235046,-1.421629},
            new object[]{ "Londonderry, Derry, UK",55.006763,-7.318268},
            new object[]{ "Salisbury, Wiltshire, UK",51.068787,-1.794472},
            new object[]{ "Weymouth, Dorset, UK",50.614429,-2.457621},
            new object[]{ "Wolverhampton, West Midlands, UK",52.59137,-2.110748},
            new object[]{ "Preston, Lancashire, UK",53.765762,-2.692337},
            new object[]{ "Bournemouth, UK",50.720806,-1.904755},
            new object[]{ "Doncaster, South Yorkshire, UK",53.52282,-1.128462},
            new object[]{ "Ayr, South Ayrshire, UK",55.458565,-4.629179},
            new object[]{ "Hastings, East Sussex, UK",50.854259,0.573453},
            new object[]{ "Bedford, UK",52.136436,-0.460739},
            new object[]{ "Basildon, Essex, UK",51.572376,0.470009},
            new object[]{ "Chippenham, Wiltshire, UK",51.458057,-2.116074},
            new object[]{ "Belfast, UK",54.607868,-5.926437},
            new object[]{ "Uckfield, East Sussex, UK",50.967941,0.085831},
            new object[]{ "Worthing, West Sussex, UK",50.825024,-0.383835},
            new object[]{ "Leeds, West Yorkshire, UK",53.801277,-1.548567},
            new object[]{ "Kendal, Cumbria, UK",54.328506,-2.74387},
            new object[]{ "Plymouth, UK",50.376289,-4.143841},
            new object[]{ "Haverhill, Suffolk, UK",52.080875,0.444517},
            new object[]{ "Frankton, Warwickshire, UK",52.328415,-1.377561},
            new object[]{ "Inverness, the UK",57.477772,-4.224721}};


        private static  Dictionary<string, dynamic> routers {get;set;}
        public static List<WebSocket> pushClients {get;set;}

        private static async void StartKestralAsync() {

            routers = new Dictionary<string, dynamic>();
            pushClients = new List<WebSocket>();

            Random random = new Random();

            void newRouter(int cnt) {
                Console.WriteLine($"sending {cnt - routers.Count} to {pushClients.Count} stored clients");

                for (int i = routers.Count ; i < cnt; i++) {

                    var router_key = Guid.NewGuid().ToString();

                    var random_town  = UK_Towns[ random.Next(0, UK_Towns.Length)];
                    var random_lat =  Convert.ToDouble(random_town[1]) + Convert.ToDouble(random.Next(-100, 100)/1000.0);
                    var random_long =  Convert.ToDouble(random_town[2]) + Convert.ToDouble(random.Next(-100, 100)/1000.0);
                    var router_val = new {id = router_key, address = random_town[0], latlong = new double[]{  random_lat, random_long}};
                
                
                    routers.Add(router_key, router_val);

                    pushClients.ForEach((WebSocket ws) =>  {
                        try {
                            if (ws.State == WebSocketState.Open) {
                                Console.WriteLine ("Sending...");
                                var encoded = System.Text.Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new{type = "router", value = new []{router_val}}));
                                ws.SendAsync(new ArraySegment<Byte>(encoded, 0, encoded.Length), WebSocketMessageType.Text, true, System.Threading.CancellationToken.None);
                            }
                        } catch (Exception e) {
                            Console.WriteLine($"Caught Error {e}");
                        }
                    });
                }
            }

            async Task listenForMessages (WebSocket ws) {
                var buffer = new byte[1024 * 4];

                Console.WriteLine ($"Keep Socket open, keep a receiver on it. (ws.State = {ws.State}) (to close, send {CancellationToken.None}");

                // send add current routers
                if (routers.Count > 0) {
                    var encoded = System.Text.Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new{type = "router", value = routers.Values}));
                     await ws.SendAsync(new ArraySegment<Byte>(encoded, 0, encoded.Length), WebSocketMessageType.Text, true, CancellationToken.None);
                }
                // keep socket open
                while (ws.State == WebSocketState.Open)
                {
                    WebSocketReceiveResult result = null;
                    try {  
                        result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                        if (!result.CloseStatus.HasValue) {
                            Console.WriteLine ($"got message, handle it, then listen for another one {new ArraySegment<byte>(buffer, 0, result.Count)}, type:  {result.MessageType}" );
                        } else {
                            await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                        }
                    } catch (Exception e) {
                        //Console.WriteLine($"Caught Error");
                    }
                }
                Console.WriteLine ("Socket has been closed");
            }

            Console.WriteLine ($"PATH: {Path.Combine(Directory.GetCurrentDirectory(), "public")}");

            Action<IApplicationBuilder> appPipeline = (app) => {

/*
                var applicationLifetime = app.ApplicationServices.GetRequiredService<IApplicationLifetime>();
                applicationLifetime.ApplicationStopping.Register(() => {
                    Console.WriteLine ("Gracfully shutting down Sockets");
                    pushClients.ForEach(async (WebSocket ws) =>  {
                        Console.WriteLine($"Open");
                    });
                });
*/
                app.UseDefaultFiles();
                app.UseStaticFiles();
                app.UseWebSockets(); // build in middleware 

                app.Map("/setActors", (app1) => {
                    app1.Run(async context => {

                        if (context.Request.Method == "POST") {
                            using (StreamReader inputStream = new StreamReader(context.Request.Body))
                            {
                                var payload = inputStream.ReadToEnd();
                                var body = JsonConvert.DeserializeObject<Dictionary<string, string>>(payload);
                                var cnt = Int32.Parse(body["number"]);

                                newRouter(cnt);
                                // await context.Response.WriteAsync(JsonConvert.SerializeObject(new{host = Dns.GetHostName(), os = RuntimeInformation.OSDescription}));
                            }
                        } else {
                            context.Response.StatusCode = 400;
                            //var paths = context.Request.Path.Value.Split('/');
                            //if (paths.Length < 2  || String.IsNullOrEmpty(paths[1])) {
                        }
                    });
                });

                app.Map("/test", (app1) => {
                    app1.Run(async context => {

                        var paths = context.Request.Path.Value.Split('/');
                        if (paths.Length < 2  || String.IsNullOrEmpty(paths[1])) {
                            await context.Response.WriteAsync(JsonConvert.SerializeObject(new{host = Dns.GetHostName(), os = RuntimeInformation.OSDescription}));
                        } else {
                            context.Response.StatusCode = 400;
                        }

                    });
                });

                app.Map("/ws", (app1) => {
                    app1.Run(async context => {
                        if (context.WebSockets.IsWebSocketRequest) {
                            Console.WriteLine ("New Websocket connection from client, lets accept");
                            WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                            pushClients.Add(webSocket);
                            await listenForMessages(webSocket); // await to keep the socket open!
                            
                        }
                        else {
                            Console.WriteLine ("New Websocket connection - sending 400");
                            context.Response.StatusCode = 400;
                        }
                    });
                });
            };

            var host = new WebHostBuilder()
                .UseKestrel()
                .Configure(appPipeline)
                .UseContentRoot(Directory.GetCurrentDirectory())
                //.UseWebRoot(Path.Combine(Directory.GetCurrentDirectory(), "public/"))
                .ConfigureLogging((hostingContext, logging) =>  logging.AddConsole())
                .Build();

            await host.RunAsync();
            Console.WriteLine("any key to terminate"); 
            
            
        }


        static void Main(string[] args)
        {
            StartKestralAsync();
            Console.Read();
        }
    }
}
