using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public async Task SendMessage(string toUserId, string message)
    {
        var fromUserId = Context.UserIdentifier;
        await Clients.User(toUserId).SendAsync("ReceiveMessage", fromUserId, message);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
