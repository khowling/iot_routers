using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Router
{


    internal class RouterManagement {

        protected Dictionary<string, dynamic> state {get;set;}

        // While a stateful service is running, only the Primary replicas of that stateful services have their communication listeners opened and their RunAsync method called
        // If the service is currently a Primary, the service's StatefulServiceBase.RunAsync() method is called.
        public async Task RunAsync(CancellationToken cancellationToken) {
            state = new Dictionary<string, dynamic>();

            while (true) {
                cancellationToken.ThrowIfCancellationRequested();

                
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}