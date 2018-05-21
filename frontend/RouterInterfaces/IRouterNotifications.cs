using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.ServiceFabric.Actors;

namespace RouterInterfaces
{
    public interface IRouterNotifications : IActorEvents
    {
        void TelemetryChange(long routerId, string status);
    }
}
