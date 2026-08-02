// Payloads sent to the websocket API.
export {};

declare global {
  /** Most party endpoints only need to identify the party. */
  type PartyIdDto = {
    partyId: number;
  };

  type GetPartyDto = PartyIdDto;
  type OpenPartyDto = PartyIdDto;
  type ClosePartyDto = PartyIdDto;
  type JoinPartyDto = PartyIdDto;
  type RemovePartyDto = PartyIdDto;
  type QuitPartyDto = PartyIdDto;

  type KickFromPartyDto = PartyIdDto & {
    kickedEmail: string;
  };

  type PromotePartyMemberDto = PartyIdDto & {
    promotedEmail: string;
  };

  type InviteToPartyDto = PartyIdDto & {
    invitedEmail: string;
  };

  type SendPartyChatMessageDto = PartyIdDto & {
    message: string;
  };
}
