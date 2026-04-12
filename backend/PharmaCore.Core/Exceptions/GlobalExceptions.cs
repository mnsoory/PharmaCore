

namespace PharmaCore.Core.Exceptions
{
    public class BaseException : Exception
    {
        public BaseException(string message) : base(message) { }
    }

    public class BusinessException : BaseException
    {
        public BusinessException(string message) : base(message) { }
    }

    public class NotFoundException : BaseException
    {
        public NotFoundException(string message) : base(message) { }
    }

    public class UnauthorizedException : BaseException
    {
        public UnauthorizedException(string message) : base(message) { }
    }

    public class ConflictException : BaseException
    {
        public ConflictException(string message) : base(message) { }
    }
}

