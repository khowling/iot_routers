using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Actors;
using Microsoft.ServiceFabric.Actors.Remoting.FabricTransport;
using Microsoft.ServiceFabric.Services.Remoting;

[assembly: FabricTransportActorRemotingProvider(RemotingListener = RemotingListener.V2Listener, RemotingClient = RemotingClient.V2Client)]
namespace RouterInterfaces
{
    /// <summary>
    /// This interface defines the methods exposed by an actor.
    /// Clients use this interface to interact with the actor that implements it.
    /// </summary>
    public interface IRouter : IActor
    {
        /// <summary>
        /// TODO: Replace with your own actor method.
        /// </summary>
        /// <returns></returns>
        Task<string> GetStatusAsync(CancellationToken cancellationToken);

        Task<Tuple<string, string, double, double>> GetProps (CancellationToken cancellationToken);

        /// <summary>
        /// TODO: Replace with your own actor method.
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        Task  InitRouterAsync(int telemetryInterval, string router_key, string address,  double lat, double lon, string status, CancellationToken cancellationToken);
    }
}
