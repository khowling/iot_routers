using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.ServiceFabric.Actors.Runtime;

using RouterInterfaces;


namespace Router
{
   
    [StatePersistence(StatePersistence.Persisted)]
    public class Router :  IRouter
    {
        
        public class StateManagerDummy {

            protected Dictionary<string, dynamic> state {get;set;}
            
            public StateManagerDummy() {
               state = new Dictionary<string, dynamic>();
            } 

            public Task<T> GetStateAsync<T> (string key, CancellationToken ct) {
                return Task.FromResult(state[key]);
                //return new Task<T>(() => {
                //     return state[key];
                //});
            
            }

            public Task SetStateAsync (string key, dynamic val) {
                state.Add(key, val);
                return Task.CompletedTask;
            }
        } 
        public StateManagerDummy StateManager { get; set;}
        private Timer emit {get;set;}

        public Router() {
            
        }

        private Task EmitTelemetry(object state)
        {
            //ActorEventSource.Current.ActorMessage(this, "Actor EmitTelemetry called");

            //var routerEvents = GetEvent<IRouterNotifications>();
            //routerEvents.TelemetryChange(this.GetActorId().GetLongId(), "active");

            Console.WriteLine ("Emit");
            return Task.FromResult(true);

        }

        Task<string> IRouter.GetStatusAsync(CancellationToken cancellationToken)  {
            return this.StateManager.GetStateAsync<string>("status", cancellationToken);
        }

        Task<Tuple<string, string, double, double>> IRouter.GetProps (CancellationToken cancellationToken) {
             return this.StateManager.GetStateAsync<Tuple<string, string, double, double>>("props", cancellationToken);
        }

        async Task IRouter.InitRouterAsync(int telemetryInterval, string router_key, string address,  double lat, double lon, string status, CancellationToken cancellationToken)
        {
            StateManager = new StateManagerDummy();
            //ActorEventSource.Current.ActorMessage(this, "Actor StartSimulation called");
            await Task.WhenAll(
                this.StateManager.SetStateAsync("props", Tuple.Create(router_key, address, lat, lon)),
                this.StateManager.SetStateAsync("status", status)
            );
            this.emit = new Timer(_ => this.EmitTelemetry(null), null, 0, telemetryInterval);
        }
    }
}
