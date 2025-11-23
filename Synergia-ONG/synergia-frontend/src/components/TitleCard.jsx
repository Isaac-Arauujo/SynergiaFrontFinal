import React from 'react';
import { Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TitleCard = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  variant = 'default',
  icon,
  className = ""
}) => {
  const getVariantStyles = () => {
    const baseStyles = "bg-white rounded-lg shadow-sm border p-6";
    
    const variants = {
      default: "border-gray-200",
      info: "border-blue-200 bg-blue-50",
      success: "border-green-200 bg-green-50",
      warning: "border-yellow-200 bg-yellow-50",
      error: "border-red-200 bg-red-50"
    };
    
    return `${baseStyles} ${variants[variant]}`;
  };

  const getIcon = () => {
    if (icon) return icon;
    
    const icons = {
      info: <Info className="h-5 w-5 text-blue-500" />,
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />
    };
    
    return icons[variant] || null;
  };

  const iconComponent = getIcon();

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {iconComponent && (
            <div className="flex-shrink-0 mt-1">
              {iconComponent}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 leading-6">
              {title}
            </h3>
            
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1 leading-5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Ações */}
        {actions && (
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Componentes especializados para variantes comuns
TitleCard.Info = (props) => <TitleCard variant="info" {...props} />;
TitleCard.Success = (props) => <TitleCard variant="success" {...props} />;
TitleCard.Warning = (props) => <TitleCard variant="warning" {...props} />;
TitleCard.Error = (props) => <TitleCard variant="error" {...props} />;

export default TitleCard;