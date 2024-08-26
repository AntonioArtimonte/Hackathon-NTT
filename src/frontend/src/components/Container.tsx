interface ContainerProps {
    image: string; // Base64 image string
  }
  
  export function Container({ image }: ContainerProps) {
    return (
      <div
        className="h-full bg-cover bg-center text-white rounded flex flex-col lg:flex p-20"
        style={{ backgroundImage: `url(data:image/jpeg;base64,${image})` }}
      >
      </div>
    );
  }
  