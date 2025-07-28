import { userShortName } from "@/lib/utils";
import type { User } from "@/types/user";

type FallbackAvatarProps = {
  user: User;
};

const FallbackAvatar = ({ user }: FallbackAvatarProps) => {
  return (
    <div className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
      <span className="text-[10px] leading-[100%]">
        {userShortName(user.firstName, user.lastName)}
      </span>
    </div>
  );
};

export default FallbackAvatar;
